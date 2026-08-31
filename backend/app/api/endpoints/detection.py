import logging

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
logger = logging.getLogger(__name__)


def _predict_message_safely(text: str) -> dict:
    """Get an ML result without allowing model problems to interrupt the API."""
    try:
        result = ml_classifier.predict(text)
        if isinstance(result, dict):
            return result
        logger.warning("ML classifier returned a non-dict result; using rules only.")
    except Exception:
        logger.exception("ML classifier failed during message analysis; using rules only.")

    return {"prediction": "safe", "probability": 0.0, "model_ready": False}

@router.post("/analyze/message", response_model=MessageAnalysisResponse, tags=["Detection"])
def analyze_message(request: MessageAnalysisRequest) -> MessageAnalysisResponse:
    """
    Analyzes a text message or email for phishing indicators and returns risk scoring.
    """
    # Preserve the Round 2 heuristic analysis as the baseline, then let the
    # risk engine add a bounded ML phishing signal when the model is available.
    result = message_analyzer.analyze(request.text)
    ml_result = _predict_message_safely(request.text)
    risk_score = risk_engine.calculate_hybrid_score(result["risk_score"], ml_result)
    risk_level = risk_engine.determine_level(risk_score)

    findings = list(result["findings"])
    ml_bonus = risk_engine.calculate_ml_bonus(ml_result)
    if ml_bonus:
        findings.append(
            "ML classifier detected phishing-like language "
            f"(confidence: {float(ml_result['probability']):.2f})"
        )

    explanation = gemini_explainer.explain(
        content_type="message",
        raw_content=request.text,
        findings=findings,
        risk_score=risk_score,
        risk_level=risk_level,
    )
    safe_action = message_analyzer.build_safe_action(risk_level)
    
    return MessageAnalysisResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        findings=findings,
        explanation=explanation,
        safe_action=safe_action
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
        explanation=result["explanation"],
        safe_action=result["safe_action"]
    )
