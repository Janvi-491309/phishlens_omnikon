from typing import List
from app.models.schemas import AnalysisFinding

class GeminiExplainer:
    """
    Stub for the Gemini explanation engine.
    Will interface with Google Gemini API to generate plain-text, user-friendly
    explanations explaining why a message or URL was flagged or considered safe.
    """
    def __init__(self):
        pass

    def explain(self, content_type: str, raw_content: str, findings: List[AnalysisFinding], risk_score: float) -> str:
        """
        Sends aggregated findings to Gemini to get a readable security explanation.
        Currently returns a static fallback explanation for MVP setup.
        """
        if not findings:
            return "No suspicious indicators were detected in the analyzed content. The item appears to be safe."
        
        return "This is a placeholder explanation. In the future, Gemini will summarize the findings and explain why the content poses a risk."

gemini_explainer = GeminiExplainer()
