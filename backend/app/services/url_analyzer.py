from typing import List
from app.models.schemas import AnalysisFinding

class URLAnalyzer:
    """
    Service responsible for analyzing URLs.
    Performs URL-string heuristics (e.g., domain length, suspicious TLDs, subdomain count, 
    presence of IP addresses, character obfuscation).
    No external network calls, downloads, or web execution are performed.
    """
    def __init__(self):
        pass

    def analyze(self, url: str) -> List[AnalysisFinding]:
        """
        Runs safe string-based analysis on the URL.
        Currently returns placeholder findings for MVP setup.
        """
        findings = []
        
        # Example of safe string heuristics to be expanded later:
        # if len(url) > 100:
        #     findings.append(AnalysisFinding(category="heuristics", description="Excessively long URL path.", severity="low"))
        
        return findings

url_analyzer = URLAnalyzer()
