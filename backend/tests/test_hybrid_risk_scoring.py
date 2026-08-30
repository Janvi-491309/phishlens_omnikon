"""Focused Round 3 Module 2 tests for hybrid message risk scoring."""

import pytest
from fastapi.testclient import TestClient

from app.api.endpoints import detection
from app.main import app
from app.services.risk_engine import risk_engine


client = TestClient(app)


def test_safe_message_keeps_rule_based_safe_score_when_ml_says_safe(monkeypatch):
    """A confident safe ML prediction must not inflate a normal message."""
    monkeypatch.setattr(
        detection.ml_classifier,
        "predict",
        lambda _: {"prediction": "safe", "probability": 0.98, "model_ready": True},
    )

    response = client.post("/api/analyze/message", json={"text": "See you at lunch tomorrow."})

    assert response.status_code == 200
    assert response.json()["risk_score"] == 0.0
    assert response.json()["risk_level"] == "SAFE"


def test_rule_and_ml_agreement_increase_obvious_phishing_score(monkeypatch):
    """Rule evidence plus a phishing ML result produces a deterministic score."""
    monkeypatch.setattr(
        detection.ml_classifier,
        "predict",
        lambda _: {"prediction": "phishing", "probability": 0.9, "model_ready": True},
    )

    response = client.post(
        "/api/analyze/message",
        json={"text": "Please verify your credentials immediately."},
    )

    data = response.json()
    # Rules: 20 urgency + 25 credentials = 45; ML: 35 * 0.9 = 31.5.
    assert data["risk_score"] == 76.5
    assert data["risk_level"] == "HIGH"
    assert any("ML classifier" in finding for finding in data["findings"])


def test_disagreement_preserves_rule_risk_when_ml_says_safe():
    """A safe ML result cannot downgrade deterministic phishing rules."""
    result = risk_engine.calculate_hybrid_score(
        45.0,
        {"prediction": "safe", "probability": 0.99, "model_ready": True},
    )

    assert result == 45.0
    assert risk_engine.determine_level(result) == "SUSPICIOUS"


def test_ml_only_disagreement_can_raise_to_suspicious_but_not_high():
    """ML-only evidence is bounded so it cannot be the sole HIGH-risk source."""
    result = risk_engine.calculate_hybrid_score(
        0.0,
        {"prediction": "phishing", "probability": 1.0, "model_ready": True},
    )

    assert result == 35.0
    assert risk_engine.determine_level(result) == "SUSPICIOUS"


def test_ml_failure_falls_back_to_the_rule_based_api_result(monkeypatch):
    """An unexpected classifier exception must not prevent message analysis."""
    def model_failure(_: str):
        raise RuntimeError("model unavailable")

    monkeypatch.setattr(detection.ml_classifier, "predict", model_failure)

    response = client.post(
        "/api/analyze/message",
        json={"text": "Please verify your credentials immediately."},
    )

    data = response.json()
    assert response.status_code == 200
    assert data["risk_score"] == 45.0
    assert data["risk_level"] == "SUSPICIOUS"
    assert not any("ML classifier" in finding for finding in data["findings"])


@pytest.mark.parametrize(
    ("rule_score", "ml_result", "expected"),
    [
        (-10.0, {"prediction": "safe", "probability": 1.0, "model_ready": True}, 0.0),
        (100.0, {"prediction": "phishing", "probability": 1.0, "model_ready": True}, 100.0),
        (90.0, {"prediction": "phishing", "probability": 2.0, "model_ready": True}, 100.0),
        (20.0, {"prediction": "phishing", "probability": float("nan"), "model_ready": True}, 20.0),
        (20.0, {"prediction": "phishing", "probability": "bad", "model_ready": True}, 20.0),
        (20.0, {"prediction": "phishing", "probability": 1.0, "model_ready": False}, 20.0),
    ],
)
def test_hybrid_score_is_bounded_and_handles_unavailable_ml(rule_score, ml_result, expected):
    assert risk_engine.calculate_hybrid_score(rule_score, ml_result) == expected


@pytest.mark.parametrize(
    ("score", "level"),
    [
        (0.0, "SAFE"),
        (30.0, "SAFE"),
        (30.01, "SUSPICIOUS"),
        (70.0, "SUSPICIOUS"),
        (70.01, "HIGH"),
        (100.0, "HIGH"),
    ],
)
def test_risk_level_boundaries(score, level):
    assert risk_engine.determine_level(score) == level
