from types import SimpleNamespace
from pathlib import Path
import re

from fastapi.testclient import TestClient

from app.api.endpoints import detection
from app.main import app
from app.services.gemini_explainer import GeminiExplainer
from app.services.message_analyzer import message_analyzer
from app.services.ml_classifier import MLClassifier


def test_telugu_rule_categories_are_scored_once_each():
    result = message_analyzer.analyze(
        "అత్యవసరం: మీ ఖాతా బ్లాక్ అవుతుంది. OTP పంపండి. మీరు బహుమతి గెలిచారు. SBI bank officer.",
        "te",
    )
    # urgency + threat + credentials + prize + weak impersonation
    assert result["risk_score"] == 90.0
    assert len(result["findings"]) == 5


def test_telugu_url_and_otp_are_shared_signals():
    result = message_analyzer.analyze("మీ OTP పంపండి: https://example.com/verify", "te")
    assert result["risk_score"] == 45.0


def test_romanized_telugu_equivalents_are_scored():
    result = message_analyzer.analyze("Ventane mee account verify cheyyandi, OTP pampandi", "te-Latn")
    assert result["risk_score"] == 45.0


def test_code_mixed_message_uses_existing_rules_without_double_counting():
    result = message_analyzer.analyze("మీ account వెంటనే verify cheyyandi. OTP pampandi", "mixed")
    assert result["risk_score"] == 45.0
    assert len(result["findings"]) == 2


def test_localized_safe_actions():
    assert "పంచుకోకండి" in message_analyzer.build_safe_action("SUSPICIOUS", "te")
    assert "panchukovaddu" in message_analyzer.build_safe_action("SUSPICIOUS", "te-Latn")
    assert "Do not share" in message_analyzer.build_safe_action("SUSPICIOUS", "mixed")


def test_english_safe_action_is_unchanged():
    assert message_analyzer.build_safe_action("HIGH", "en") == (
        "Do not click links or share passwords, OTPs, or other credentials. "
        "Verify the request through the official website."
    )


def test_ml_is_gated_for_non_english_languages():
    classifier = MLClassifier()
    for language in ("te", "te-Latn", "mixed"):
        assert classifier.predict("మీ ఖాతా verify cheyyandi", language) == {
            "prediction": "safe", "probability": 0.0, "model_ready": False
        }


def test_endpoint_resolves_language_and_does_not_call_ml_for_telugu(monkeypatch):
    def unexpected_model_call(_: str):
        raise AssertionError("English-only model should not be called")

    monkeypatch.setattr(detection.ml_classifier, "predict", unexpected_model_call)
    response = TestClient(app).post(
        "/api/analyze/message", json={"text": "మీ ఖాతాను వెంటనే ధృవీకరించండి. OTP పంపండి."}
    )
    assert response.status_code == 200
    assert response.json()["language"] == "te"
    assert response.json()["risk_score"] == 45.0


def test_gemini_receives_resolved_language():
    captured = {}

    def generate_content(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(text="సందేశం అనుమానాస్పదంగా ఉంది.")

    explainer = GeminiExplainer(client=SimpleNamespace(models=SimpleNamespace(generate_content=generate_content)))
    assert explainer.explain("message", "OTP పంపండి", ["Credential request"], 25.0, "SAFE", "te")
    assert '"resolved_language": "te"' in captured["contents"]


def test_gemini_failure_uses_localized_fallback():
    def generate_content(**_):
        raise RuntimeError("unavailable")

    explainer = GeminiExplainer(client=SimpleNamespace(models=SimpleNamespace(generate_content=generate_content)))
    explanation = explainer.explain("message", "OTP పంపండి", ["Credential request"], 25.0, "SAFE", "te")
    assert "ప్రమాద స్కోరు" in explanation


def test_telugu_literals_are_utf8_and_render_from_python():
    services_dir = Path(__file__).resolve().parents[1] / "app" / "services"
    analyzer_source = (services_dir / "message_analyzer.py").read_text(encoding="utf-8")
    explainer_source = (services_dir / "gemini_explainer.py").read_text(encoding="utf-8")

    assert "బహుమతి" in analyzer_source
    assert "ప్రమాద స్కోరు" in explainer_source
    assert "బహుమతి" in message_analyzer.prize_keywords
    assert "à°" not in analyzer_source
    assert "à°" not in explainer_source


def test_all_localized_fallbacks_are_readable_and_telugu_is_valid_unicode():
    fallbacks = {
        language: GeminiExplainer._fallback(25.0, "SAFE", ["Credential request"], language)
        for language in ("en", "te", "te-Latn", "mixed")
    }

    assert fallbacks["en"].startswith("This message was classified")
    assert fallbacks["te-Latn"].startswith("Ee sandesam")
    assert fallbacks["mixed"].startswith("This message is")
    for language in ("te", "mixed"):
        assert re.search(r"[\u0C00-\u0C7F]", fallbacks[language])
        assert "à°" not in fallbacks[language]


def test_generic_bank_terms_do_not_add_impersonation_points():
    telugu_result = message_analyzer.analyze("వెంటనే బ్యాంక్‌కు కాల్ చేయండి", "te")
    account_result = message_analyzer.analyze("వెంటనే మీ ఖాతాను ధృవీకరించండి", "te")

    assert telugu_result["risk_score"] == 20.0
    assert account_result["risk_score"] == 20.0
    assert not any("Impersonation-related" in finding for finding in telugu_result["findings"])


def test_specific_telugu_bank_role_remains_an_impersonation_signal():
    result = message_analyzer.analyze("వెంటనే బ్యాంక్ అధికారి చెప్పినట్లు చేయండి", "te")
    assert result["risk_score"] == 30.0
    assert any("Impersonation-related" in finding for finding in result["findings"])
