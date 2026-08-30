import math
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

    # The ML model is an additional signal, not a replacement for the existing
    # deterministic rules.  A strong ML-only signal can reach SUSPICIOUS, but
    # cannot classify a message as HIGH without supporting rule evidence.
    ML_PHISHING_BONUS_MAX = 35.0

    def calculate_ml_bonus(self, ml_result: Dict[str, Any]) -> float:
        """Return the bounded ML contribution to a message risk score.

        Only a ready classifier that explicitly predicts ``phishing`` adds
        risk.  Invalid, unavailable, failed, or safe predictions contribute
        zero, which preserves the Round 2 rule-based result as a safe fallback.
        """
        if not isinstance(ml_result, dict) or not ml_result.get("model_ready"):
            return 0.0
        if str(ml_result.get("prediction", "")).lower() != "phishing":
            return 0.0

        try:
            probability = float(ml_result.get("probability", 0.0))
        except (TypeError, ValueError):
            return 0.0
        if not math.isfinite(probability):
            return 0.0

        probability = max(0.0, min(probability, 1.0))
        return round(self.ML_PHISHING_BONUS_MAX * probability, 2)

    def calculate_hybrid_score(self, rule_score: float, ml_result: Dict[str, Any]) -> float:
        """Combine Round 2 rules with an optional ML phishing signal.

        ``final = clamp(rule_score + 35 * phishing_confidence, 0, 100)``
        when the loaded model predicts phishing; otherwise ``final`` is the
        original rule score.  This makes the calculation deterministic,
        prevents a model failure from changing API behaviour, and keeps rules
        sufficient to produce HIGH risk on their own.
        """
        try:
            baseline = float(rule_score)
        except (TypeError, ValueError):
            baseline = 0.0
        if not math.isfinite(baseline):
            baseline = 0.0

        baseline = max(0.0, min(baseline, 100.0))
        return round(min(baseline + self.calculate_ml_bonus(ml_result), 100.0), 2)

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
        Translates a numeric 0.0-100.0 score into the public API risk level.
        """
        try:
            score = float(score)
        except (TypeError, ValueError):
            score = 0.0
        if not math.isfinite(score):
            score = 0.0
        score = max(0.0, min(score, 100.0))
        if score <= 30.0:
            return "SAFE"
        if score <= 70.0:
            return "SUSPICIOUS"
        return "HIGH"

risk_engine = RiskEngine()
