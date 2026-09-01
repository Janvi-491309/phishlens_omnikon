import re
import unicodedata
from typing import Dict, Any, List

class MessageAnalyzer:
    """
    Service responsible for rule-based analysis of text messages/emails.
    Flags keywords, urgency patterns, credential requests, URLs, scam language, and impersonation.
    """
    def __init__(self):
        # Category keywords (lowercase for case-insensitive matching)
        self.urgency_keywords = [
            "urgent", "immediately", "asap", "action required", "hurry", 
            "verify now", "expires", "restricted", "suspended", "last chance", 
            "limited time"
        ]
        
        self.threat_keywords = [
            "legal action", "lawsuit", "arrest", "close your account", 
            "deactivated", "shut down", "penalty", "police", "court", 
            "termination", "prosecution", "consequences"
        ]
        
        self.credential_keywords = [
            "password", "otp", "pin", "cvv", "social security", "ssn", 
            "credit card", "credentials", "login details", "verify password", 
            "security code", "two-factor", "2fa"
        ]
        
        self.prize_keywords = [
            "won", "prize", "reward", "lottery", "gift card", "winner", 
            "selected", "claim", "free", "cash bonus", "giveaway", 
            "congratulations", "lucky"
        ]
        
        self.impersonation_keywords = [
            "netflix", "paypal", "amazon", "google", "apple", "microsoft", 
            "bank of america", "chase", "wells fargo", "support team", "admin", 
            "helpdesk", "it support", "security department", "customer service",
            "sbi"
        ]

        # Curated Telugu and Romanized Telugu equivalents for the existing
        # categories.  They supplement (rather than replace) the English rules.
        self.urgency_keywords.extend([
            "వెంటనే", "ఇప్పుడే", "తక్షణం", "అత్యవసరం", "త్వరగా",
            "ventane", "ippude", "takshanam", "atyavasaram", "verify cheyyandi",
        ])
        self.threat_keywords.extend([
            "చట్టపరమైన చర్య", "అరెస్ట్", "జరిమానా", "ఖాతా బ్లాక్", "ఖాతా నిలిపివేయబడింది",
            "ఖాతా సస్పెండ్", "legal action", "arrest", "account block", "account suspend",
        ])
        self.credential_keywords.extend([
            "పాస్‌వర్డ్", "పాస్వర్డ్", "ఓటీపీ", "పిన్", "సీవీవీ", "వివరాలు పంపండి",
            "password pampandi", "otp pampandi", "pin pampandi", "credentials pampandi",
        ])
        self.prize_keywords.extend([
            "బహుమతి", "గెలిచారు", "లాటరీ", "రివార్డు", "నగదు బహుమతి",
            "dabbu gelicharu", "prize gelicharu", "bahumati", "lottery gelicharu",
        ])
        self.impersonation_keywords.extend([
            "bank customer care", "bank officer", "sbi officer", "bank manager",
            "బ్యాంక్ కస్టమర్ కేర్", "బ్యాంక్ అధికారి", "బ్యాంక్ మేనేజర్", "ఎస్‌బీఐ అధికారి",
        ])

        # Small, curated Hindi equivalents. Generic terms such as "बैंक" are
        # intentionally excluded; impersonation needs a role-specific claim.
        self.urgency_keywords.extend(["तुरंत", "अभी", "तत्काल"])
        self.threat_keywords.extend(["खाता निलंबित", "खाता बंद", "खाता ब्लॉक"])
        self.credential_keywords.extend(["ओटीपी", "पासवर्ड", "पिन"])
        self.prize_keywords.extend(["इनाम", "पुरस्कार", "लॉटरी", "जीत गए"])
        self.impersonation_keywords.extend(["बैंक अधिकारी", "एसबीआई अधिकारी", "ग्राहक सेवा अधिकारी"])
        
        # URL Regex matching http/https links, www. links, or common domains
        self.url_pattern = re.compile(
            r'https?://[^\s<>"]+|www\.[^\s<>"]+|\b[a-zA-Z0-9-]+\.(?:com|net|org|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|us|uk|in|ly|gl|io|xyz|cc|sbi)\b',
            re.IGNORECASE
        )

    @staticmethod
    def build_explanation(score: float, risk_level: str, findings: List[str]) -> str:
        """Build the user-facing explanation for a final message assessment."""
        if not findings:
            return "No suspicious indicators were detected in the message. It appears to be safe."
        return (
            f"This message was classified as {risk_level} with a risk score of {score}/100. "
            f"It triggered the following indicators: {', '.join(findings)}."
        )

    @staticmethod
    def build_safe_action(risk_level: str, language: str = "en") -> str:
        """Return the established Round 2 safety guidance for a risk level."""
        if language == "te":
            if risk_level == "SAFE":
                return "తక్షణ చర్య అవసరం లేదు. సాధారణ భద్రతా జాగ్రత్తలు కొనసాగించండి."
            if risk_level == "SUSPICIOUS":
                return "పాస్‌వర్డ్‌లు, OTPలు లేదా వివరాలు పంచుకోకండి. సంస్థ అధికారిక వెబ్‌సైట్‌లో ధృవీకరించండి."
            return "లింక్‌లను తెరవకండి లేదా పాస్‌వర్డ్‌లు, OTPలు, వివరాలు పంచుకోకండి. అధికారిక వెబ్‌సైట్‌లో ధృవీకరించండి."
        if language == "te-Latn":
            if risk_level == "SAFE":
                return "Ventane emi cheyalsina avasaram ledu. Saadharana bhadrata jagrathalu patinchandi."
            if risk_level == "SUSPICIOUS":
                return "Passwords, OTPs, leda credentials panchukovaddu. Samstha adhikarika website lo verify cheyyandi."
            return "Links open cheyakandi leda passwords, OTPs, credentials panchukovaddu. Adhikarika website lo verify cheyyandi."
        if language == "hi":
            if risk_level == "SAFE":
                return "तत्काल कोई कार्रवाई आवश्यक नहीं है। सामान्य सुरक्षा सावधानियाँ जारी रखें।"
            if risk_level == "SUSPICIOUS":
                return "पासवर्ड, OTP या अन्य जानकारी साझा न करें। संस्था की आधिकारिक वेबसाइट से संदेश सत्यापित करें।"
            return "लिंक न खोलें और पासवर्ड, OTP या अन्य जानकारी साझा न करें। अनुरोध को आधिकारिक वेबसाइट से सत्यापित करें।"
        if language == "mixed":
            if risk_level == "SAFE":
                return "No immediate action is required. సాధారణ భద్రతా జాగ్రత్తలు కొనసాగించండి."
            if risk_level == "SUSPICIOUS":
                return "Do not share passwords, OTPs, or credentials. సంస్థ అధికారిక వెబ్‌సైట్‌లో ధృవీకరించండి."
            return "Do not click links or share passwords, OTPs, or credentials. అధికారిక వెబ్‌సైట్‌లో ధృవీకరించండి."
        if risk_level == "SAFE":
            return "No immediate action is required. Continue to use normal security precautions."
        if risk_level == "SUSPICIOUS":
            return "Do not share passwords, OTPs, or credentials. Verify the message through the organization's official website."
        return "Do not click links or share passwords, OTPs, or other credentials. Verify the request through the official website."

    def analyze(self, text: str, language: str = "en") -> Dict[str, Any]:
        """
        Runs rule-based checks on the message content and calculates the risk score and findings.
        """
        text_lower = unicodedata.normalize("NFKC", text).casefold()
        findings = []
        score = 0
        
        detected_other = False
        
        # 1. Urgency (Score: 20)
        matched_urgency = [kw for kw in self.urgency_keywords if kw in text_lower]
        if matched_urgency:
            findings.append(f"Urgent language detected: immediate action requested (matched: '{matched_urgency[0]}')")
            score += 20
            detected_other = True
            
        # 2. Threat (Score: 20)
        matched_threat = [kw for kw in self.threat_keywords if kw in text_lower]
        if matched_threat:
            findings.append(f"Threatening language detected: warning of account action or legal consequences (matched: '{matched_threat[0]}')")
            score += 20
            detected_other = True
            
        # 3. Credential Request (Score: 25)
        matched_credential = [kw for kw in self.credential_keywords if kw in text_lower]
        if matched_credential:
            findings.append(f"Credential request detected: asking for passwords, security codes, or credentials (matched: '{matched_credential[0]}')")
            score += 25
            detected_other = True
            
        # 4. URL (Score: 20)
        matched_urls = self.url_pattern.findall(text)
        if matched_urls:
            findings.append(f"URL or domain detected (matched: '{matched_urls[0]}')")
            score += 20
            detected_other = True
            
        # 5. Prize/Reward (Score: 15)
        matched_prize = [kw for kw in self.prize_keywords if kw in text_lower]
        if matched_prize:
            findings.append(f"Prize/reward scam language detected: mentioning wins, prizes, or gifts (matched: '{matched_prize[0]}')")
            score += 15
            detected_other = True
            
        # 6. Impersonation (Score: 10 - Weak Signal)
        matched_impersonation = [kw for kw in self.impersonation_keywords if kw in text_lower]
        if matched_impersonation:
            if detected_other:
                findings.append(f"Impersonation-related term detected: references to known brands or support roles (matched: '{matched_impersonation[0]}')")
                score += 10
            else:
                # Weak signal: Do not add score or finding if no other indicator is present.
                pass
                
        # Cap the final score at 100
        score = min(score, 100)
        
        # Risk levels: 0-30 = SAFE, 31-70 = SUSPICIOUS, 71-100 = HIGH
        if score <= 30:
            risk_level = "SAFE"
        elif score <= 70:
            risk_level = "SUSPICIOUS"
        else:
            risk_level = "HIGH"
            
        explanation = self.build_explanation(float(score), risk_level, findings)
        safe_action = self.build_safe_action(risk_level, language)

        return {
            "risk_score": float(score),
            "risk_level": risk_level,
            "findings": findings,
            "explanation": explanation,
            "safe_action": safe_action,
        }

message_analyzer = MessageAnalyzer()
