from fastapi import APIRouter
from app.models.schemas import (
    MessageAnalysisRequest,
    MessageAnalysisResponse,
    URLAnalysisRequest,
    URLAnalysisResponse
)
from app.services import (
    message_analyzer,
    url_analyzer,
    risk_engine,
    ml_classifier,
    gemini_explainer
)

router = APIRouter()

@router.post("/analyze/message", response_model=MessageAnalysisResponse, tags=["Detection"])
def analyze_message(request: MessageAnalysisRequest) -> MessageAnalysisResponse:
    """
    Analyzes a text message or email for phishing indicators and returns risk scoring.
    """
    # Run the modular rule-based message analysis
    result = message_analyzer.analyze(request.text)
    
    return MessageAnalysisResponse(
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        findings=result["findings"],
        explanation=result["explanation"]
    )

@router.post("/analyze/url", response_model=URLAnalysisResponse, tags=["Detection"])
def analyze_url(request: URLAnalysisRequest) -> URLAnalysisResponse:
    """
    Analyzes a URL for suspicious string features and patterns without visiting it.
    """
    result = url_analyzer.analyze(request.url)
    
    # Suspicious if risk score is above safe threshold (> 30.0)
    is_suspicious = (result["risk_score"] >= 31.0)
    
    return URLAnalysisResponse(
        url=request.url,
        is_suspicious=is_suspicious,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        findings=result["findings"],
        explanation=result["explanation"]
    )
