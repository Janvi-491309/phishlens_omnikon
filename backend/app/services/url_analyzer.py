import re
from typing import Dict, Any, List
from urllib.parse import urlparse

class URLAnalyzer:
    """
    Service responsible for analyzing URLs.
    Performs URL-string heuristics (e.g., protocol, domain length, suspicious TLDs, subdomain count, 
    presence of IP addresses, character obfuscation).
    No external network calls, downloads, or web execution are performed.
    """
    def __init__(self):
        # Known URL shortening domains
        self.shorteners = {
            "bit.ly", "tinyurl.com", "t.co", "goo.gl", "rebrand.ly", "tiny.cc", 
            "is.gd", "buff.ly", "adf.ly", "bit.do", "ow.ly", "mcaf.ee", "su.pr"
        }
        
        # Phishing keyword indicators
        self.suspicious_keywords = [
            "login", "verify", "verification", "secure", "account", 
            "update", "password", "otp", "banking", "wallet", "claim", "prize"
        ]
        
        # Unusual TLDs often used for phishing
        self.suspicious_tlds = {
            "xyz", "top", "tk", "ml", "ga", "cf", "gq", "fit", "work", "click", "buzz", "country"
        }

    def analyze(self, url: str) -> Dict[str, Any]:
        """
        Runs safe string-based analysis on the URL.
        Calculates a risk score, risk level, findings, and explanations.
        """
        findings = []
        score = 0
        
        url_lower = url.lower()
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        
        # Remove port if present in domain
        if ":" in domain:
            domain = domain.split(":")[0]

        # 1. HTTP Protocol Check (Score: +15)
        if url_lower.startswith("http://"):
            findings.append("URL uses HTTP instead of HTTPS")
            score += 15

        # 2. URL Shortener Check (Score: +20)
        is_shortener = False
        for s in self.shorteners:
            if domain == s or domain.endswith("." + s):
                is_shortener = True
                break
        if is_shortener:
            findings.append(f"Suspicious URL shortener service used: {domain}")
            score += 20

        # 3. IP Address Check (Score: +25)
        ip_pattern = re.compile(
            r'^(?:(?:\d{1,3}\.){3}\d{1,3}|' # IPv4
            r'\[?[0-9a-fA-F:]+\]?)$'        # IPv6
        )
        is_ip = bool(ip_pattern.match(domain))
        if is_ip:
            findings.append("IP address used instead of a normal domain")
            score += 25

        # 4. Excessive Subdomains Check (Score: +15)
        if not is_ip:
            # Exclude www. if present
            check_domain = domain
            if check_domain.startswith("www."):
                check_domain = check_domain[4:]
            
            parts = check_domain.split('.')
            if len(parts) >= 4:
                findings.append("Excessive subdomains detected")
                score += 15

        # 5. Suspicious Keywords Check (Score: +15 per unique keyword)
        matched_keywords = [kw for kw in self.suspicious_keywords if kw in url_lower]
        for kw in matched_keywords:
            findings.append(f"Suspicious keyword detected: {kw}")
            score += 15

        # 6. Suspicious Characters/Encoding Check (Score: +10)
        has_suspicious_chars = False
        if "@" in url:
            has_suspicious_chars = True
        elif "%" in url:
            has_suspicious_chars = True
        elif "xn--" in domain:
            has_suspicious_chars = True
        else:
            try:
                url.encode('ascii')
            except UnicodeEncodeError:
                has_suspicious_chars = True
                
        if has_suspicious_chars:
            findings.append("Suspicious characters or encoding patterns detected")
            score += 10

        # 7. Very Long URL Check (Score: +10)
        if len(url) > 75:
            findings.append("Very long URL detected")
            score += 10

        # 8. Suspicious Domain Patterns Check (Score: +10)
        # Check for multiple hyphens (2 or more) in the domain
        # or unusual TLDs (e.g. .xyz, .top, etc.)
        tld = domain.split(".")[-1] if "." in domain else ""
        has_suspicious_domain = False
        if domain.count("-") >= 2:
            has_suspicious_domain = True
            findings.append("Suspicious domain pattern: multiple hyphens detected in domain name")
        elif tld in self.suspicious_tlds:
            has_suspicious_domain = True
            findings.append(f"Suspicious domain pattern: unusual TLD (.{tld}) detected")
            
        if has_suspicious_domain:
            score += 10

        # Cap the final score at 100
        score = min(score, 100)

        # Classify risk levels
        if score <= 30:
            risk_level = "SAFE"
        elif score <= 70:
            risk_level = "SUSPICIOUS"
        else:
            risk_level = "HIGH"

        # Generate transparent user-friendly explanation
        if not findings:
            explanation = "This URL was classified as SAFE with a risk score of 0/100 because no suspicious URL indicators were detected."
        else:
            indicator_text = "multiple suspicious URL indicators were detected" if len(findings) > 1 else "a suspicious URL indicator was detected"
            explanation = f"This URL was classified as {risk_level} with a risk score of {score}/100 because {indicator_text}."

        # Generate safe_action based on risk_level
        if risk_level == "SAFE":
            safe_action = "No immediate action is required. Continue to use normal security precautions."
        elif risk_level == "SUSPICIOUS":
            safe_action = "Avoid opening this URL or entering personal information until the website is verified."
        else:  # HIGH
            safe_action = "Do not open this URL or enter personal information. Verify the website through its official domain."

        return {
            "risk_score": float(score),
            "risk_level": risk_level,
            "findings": findings,
            "explanation": explanation,
            "safe_action": safe_action,
        }

url_analyzer = URLAnalyzer()
