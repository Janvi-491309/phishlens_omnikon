import re
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
        
        # URL Regex matching http/https links, www. links, or common domains
        self.url_pattern = re.compile(
            r'https?://[^\s<>"]+|www\.[^\s<>"]+|\b[a-zA-Z0-9-]+\.(?:com|net|org|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|us|uk|in|ly|gl|io|xyz|cc|sbi)\b',
            re.IGNORECASE
        )

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Runs rule-based checks on the message content and calculates the risk score and findings.
        """
        text_lower = text.lower()
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
            
        # Generate custom user-friendly explanation
        if not findings:
            explanation = "No suspicious indicators were detected in the message. It appears to be safe."
        else:
            explanation = (
                f"This message was classified as {risk_level} with a risk score of {score}/100. "
                f"It triggered the following indicators: {', '.join(findings)}."
            )

        # Generate safe_action based on risk_level
        if risk_level == "SAFE":
            safe_action = "No immediate action is required. Continue to use normal security precautions."
        elif risk_level == "SUSPICIOUS":
            safe_action = "Do not share passwords, OTPs, or credentials. Verify the message through the organization's official website."
        else:  # HIGH
            safe_action = "Do not click links or share passwords, OTPs, or other credentials. Verify the request through the official website."

        return {
            "risk_score": float(score),
            "risk_level": risk_level,
            "findings": findings,
            "explanation": explanation,
            "safe_action": safe_action,
        }

message_analyzer = MessageAnalyzer()
