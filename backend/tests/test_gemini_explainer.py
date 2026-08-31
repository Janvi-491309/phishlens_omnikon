"""Focused Round 3 Module 3 tests for Gemini message explanations."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.main import app
from app.services.gemini_explainer import GeminiExplainer


def _explain(explainer: GeminiExplainer) -> str:
    return explainer.explain(
        content_type="message",
        raw_content="Verify your password immediately.",
        findings=["Credential request detected"],
        risk_score=45.0,
        risk_level="SUSPICIOUS",
    )


def test_gemini_explanation_uses_mocked_api_response(monkeypatch):
    captured = {}

    def generate_content(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(text="This message is suspicious because it asks for credentials.")

    explainer = GeminiExplainer(client=SimpleNamespace(models=SimpleNamespace(generate_content=generate_content)))
    monkeypatch.setenv("GEMINI_MODEL", "test-model")

    explanation = _explain(explainer)

    assert explanation == "This message is suspicious because it asks for credentials."
    assert captured["model"] == "test-model"
    assert "SUSPICIOUS" in captured["contents"]
    assert "45.0" in captured["contents"]


def test_missing_api_key_uses_deterministic_fallback(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    explanation = _explain(GeminiExplainer())
    assert "SUSPICIOUS" in explanation
    assert "45.0/100" in explanation


def test_gemini_api_failure_uses_deterministic_fallback():
    def generate_content(**_):
        raise RuntimeError("quota exhausted")

    explainer = GeminiExplainer(client=SimpleNamespace(models=SimpleNamespace(generate_content=generate_content)))
    assert "Credential request detected" in _explain(explainer)


def test_invalid_or_empty_gemini_response_uses_deterministic_fallback():
    explainer = GeminiExplainer(client=SimpleNamespace(models=SimpleNamespace(
        generate_content=lambda **_: SimpleNamespace(text="   ")
    )))
    assert "Credential request detected" in _explain(explainer)


def test_message_analysis_works_when_gemini_is_unavailable(monkeypatch):
    from app.api.endpoints import detection

    monkeypatch.setattr(detection.gemini_explainer, "_get_client", lambda: None)
    response = TestClient(app).post(
        "/api/analyze/message", json={"text": "Please verify your credentials immediately."}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] in {"SUSPICIOUS", "HIGH"}
    assert "risk score" in data["explanation"].lower()
