from typing import List, Dict, Any
from app.models.schemas import AnalysisFinding

class RiskEngine:
    """
    Calculates unified risk score and risk level based on inputs from:
    - Rule-based heuristics (message or URL analyzer)
    - ML predictions
    - Other security metrics
    """
    def __init__(self):
        pass

    def calculate_score(self, findings: List[AnalysisFinding], ml_result: Dict[str, Any]) -> float:
        """
        Combines different signal inputs to calculate an aggregate score from 0.0 to 100.0.
        Currently returns a baseline score based on number of findings for MVP.
        """
        # Baseline score: if no findings, score is 0.0
        if not findings:
            return 0.0
        
        # Simplistic initial logic: sum of findings severity
        score = 0.0
        for finding in findings:
            if finding.severity == "low":
                score += 15.0
            elif finding.severity == "medium":
                score += 35.0
            elif finding.severity == "high":
                score += 60.0
                
        return min(score, 100.0)

    def determine_level(self, score: float) -> str:
        """
        Translates a numeric risk score (0.0 to 100.0) into a qualitative risk level.
        """
        if score == 0.0:
            return "safe"
        elif score <= 20.0:
            return "low"
        elif score <= 50.0:
            return "medium"
        elif score <= 80.0:
            return "high"
        else:
            return "critical"

risk_engine = RiskEngine()
