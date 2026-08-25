from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request Models ---

class MessageAnalysisRequest(BaseModel):
    text: str = Field(
        ...,
        description="The content of the message (email, SMS, chat, etc.) to analyze for phishing threats.",
        min_length=1
    )

class URLAnalysisRequest(BaseModel):
    url: str = Field(
        ...,
        description="The URL to analyze for security risks and suspicious characteristics.",
        min_length=4
    )


# --- Response Models ---

class AnalysisFinding(BaseModel):
    category: str = Field(..., description="The category of the finding (e.g., 'heuristics', 'blacklist', 'ml').")
    description: str = Field(..., description="Details describing the finding.")
    severity: str = Field(..., description="The severity of this specific finding ('low', 'medium', 'high').")

class MessageAnalysisResponse(BaseModel):
    risk_score: float = Field(..., description="The aggregated risk score (0.0 to 100.0).")
    risk_level: str = Field(..., description="The risk classification ('SAFE', 'SUSPICIOUS', 'HIGH').")
    findings: List[str] = Field(default=[], description="List of specific indicators flagged during analysis.")
    explanation: str = Field(
        ...,
        description="A natural language explanation of the decision, designed to be user-friendly."
    )

class URLAnalysisResponse(BaseModel):
    url: str = Field(..., description="The URL that was analyzed.")
    is_suspicious: bool = Field(..., description="Whether the URL is considered suspicious or malicious.")
    risk_score: float = Field(..., description="The aggregated risk score (0.0 to 100.0).")
    risk_level: str = Field(..., description="The risk classification ('safe', 'low', 'medium', 'high', 'critical').")
    findings: List[AnalysisFinding] = Field(default=[], description="List of specific indicators flagged during analysis.")
    explanation: str = Field(
        ...,
        description="A natural language explanation of the decision, designed to be user-friendly."
    )
