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
    # 1. Run safe URL-string heuristics
    findings = url_analyzer.analyze(request.url)
    
    # 2. Run ML predictions (using generic mock output for now)
    ml_result = {"prediction": "safe", "probability": 0.0}
    
    # 3. Calculate overall risk score and determine risk level
    score = risk_engine.calculate_score(findings, ml_result)
    level = risk_engine.determine_level(score)
    is_suspicious = (score >= 50.0)
    
    # 4. Generate user-friendly explanation using Gemini
    explanation = gemini_explainer.explain("url", request.url, findings, score)
    
    return URLAnalysisResponse(
        url=request.url,
        is_suspicious=is_suspicious,
        risk_score=score,
        risk_level=level,
        findings=findings,
        explanation=explanation
    )
