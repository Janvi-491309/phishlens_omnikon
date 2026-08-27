from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import re
from urllib.parse import urlparse

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

    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped.lower().startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        
        parsed = urlparse(v_stripped)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError('Invalid URL structure')
            
        domain = parsed.netloc
        if ':' in domain:
            domain = domain.split(':')[0]
            
        if not domain:
            raise ValueError('URL must contain a valid domain or host')
            
        ip_pattern = re.compile(
            r'^(?:(?:\d{1,3}\.){3}\d{1,3}|'
            r'\[?[0-9a-fA-F:]+\]?)$'
        )
        if domain != 'localhost' and '.' not in domain and not ip_pattern.match(domain):
            raise ValueError('URL domain must be valid')
            
        return v_stripped


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
    safe_action: str = Field(..., description="Recommended action for the user based on the risk level.")

class URLAnalysisResponse(BaseModel):
    url: str = Field(..., description="The URL that was analyzed.")
    is_suspicious: bool = Field(..., description="Whether the URL is considered suspicious or malicious.")
    risk_score: float = Field(..., description="The aggregated risk score (0.0 to 100.0).")
    risk_level: str = Field(..., description="The risk classification ('SAFE', 'SUSPICIOUS', 'HIGH').")
    findings: List[str] = Field(default=[], description="List of specific indicators flagged during analysis.")
    explanation: str = Field(
        ...,
        description="A natural language explanation of the decision, designed to be user-friendly."
    )
    safe_action: str = Field(..., description="Recommended action for the user based on the risk level.")
