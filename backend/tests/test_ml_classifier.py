"""
PhishLens — Standalone ML Classifier Unit Tests
Round 3, Module 1

Tests the MLClassifier service independently.
These tests do NOT touch any API endpoint (no HTTP calls, no TestClient).

Run with:
    pytest tests/test_ml_classifier.py -v

All 9 existing Round 2 tests in test_api.py must continue to pass
alongside these new tests.
"""

import pytest
from app.services.ml_classifier import MLClassifier


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def classifier():
    """
    Creates a single MLClassifier instance shared across all tests in this module.
    Uses scope="module" so the model is loaded from disk only once.
    """
    return MLClassifier()


# ---------------------------------------------------------------------------
# 1. Model loading
# ---------------------------------------------------------------------------

class TestModelLoading:
    def test_classifier_instantiates_without_error(self, classifier):
        """MLClassifier should construct without raising any exception."""
        assert classifier is not None

    def test_model_is_loaded(self, classifier):
        """
        The model files must exist (train_classifier.py was already run).
        is_loaded == False only means the .pkl files are missing — a
        configuration problem, not a code problem.
        """
        assert classifier.is_loaded is True, (
            "Model not loaded. Run: python models/train_classifier.py"
        )

    def test_predict_returns_dict(self, classifier):
        """predict() must always return a dict regardless of model state."""
        result = classifier.predict("test")
        assert isinstance(result, dict)

    def test_predict_dict_has_required_keys(self, classifier):
        """Return dict must contain prediction, probability, model_ready."""
        result = classifier.predict("hello world")
        assert "prediction"  in result
        assert "probability" in result
        assert "model_ready" in result


# ---------------------------------------------------------------------------
# 2. Core prediction correctness
# ---------------------------------------------------------------------------

class TestPredictions:
    def test_safe_lunch_message(self, classifier):
        """
        Required test: clearly safe conversational message.
        'Hey, are we still meeting for lunch at 12?'
        """
        result = classifier.predict("Hey, are we still meeting for lunch at 12?")
        assert result["prediction"] == "safe", (
            f"Expected 'safe', got '{result['prediction']}' "
            f"(confidence={result['probability']:.3f})"
        )

    def test_phishing_bank_suspended(self, classifier):
        """
        Required test: high-confidence phishing message with urgency + OTP request.
        'URGENT! Your bank account has been suspended. Verify your OTP immediately.'
        """
        result = classifier.predict(
            "URGENT! Your bank account has been suspended. Verify your OTP immediately."
        )
        assert result["prediction"] == "phishing", (
            f"Expected 'phishing', got '{result['prediction']}' "
            f"(confidence={result['probability']:.3f})"
        )

    def test_safe_shipping_notification(self, classifier):
        """Safe service notification should be classified as safe."""
        result = classifier.predict(
            "Your order #12345 has been shipped and will arrive by Friday."
        )
        assert result["prediction"] == "safe"

    def test_phishing_prize_scam(self, classifier):
        """Prize/reward scam should be classified as phishing."""
        result = classifier.predict(
            "Congratulations! You have won Rs. 10 lakhs! Claim your prize now!"
        )
        assert result["prediction"] == "phishing"

    def test_phishing_suspicious_link(self, classifier):
        """Message with suspicious URL should be classified as phishing."""
        result = classifier.predict(
            "Click here to verify your account: http://secure-banklogin.xyz/verify"
        )
        assert result["prediction"] == "phishing"

    def test_safe_team_meeting(self, classifier):
        """Normal workplace notification should be classified as safe."""
        result = classifier.predict("Team standup at 10am tomorrow in conference room B.")
        assert result["prediction"] == "safe"

    def test_phishing_credential_theft(self, classifier):
        """Credential theft request should be classified as phishing."""
        result = classifier.predict(
            "Please share your OTP with our agent to verify your identity."
        )
        assert result["prediction"] == "phishing"

    def test_phishing_legal_threat(self, classifier):
        """Legal threat scam should be classified as phishing."""
        result = classifier.predict(
            "Legal notice: You must pay the outstanding fine or face arrest immediately."
        )
        assert result["prediction"] == "phishing"

    def test_safe_transaction_alert(self, classifier):
        """Legitimate bank transaction SMS should be classified as safe."""
        result = classifier.predict(
            "Your salary of Rs. 45,000 has been credited to your account."
        )
        assert result["prediction"] == "safe"

    def test_phishing_account_suspended(self, classifier):
        """Account suspension phishing message should be classified as phishing."""
        result = classifier.predict(
            "ALERT: Your PayPal account has been limited. Verify your information immediately."
        )
        assert result["prediction"] == "phishing"


# ---------------------------------------------------------------------------
# 3. Probability correctness
# ---------------------------------------------------------------------------

class TestProbability:
    def test_probability_is_float(self, classifier):
        """probability must be a Python float."""
        result = classifier.predict("Hello there!")
        assert isinstance(result["probability"], float)

    def test_probability_between_zero_and_one(self, classifier):
        """probability must always be in [0.0, 1.0]."""
        test_cases = [
            "Hey, are we still meeting for lunch at 12?",
            "URGENT: Your account has been suspended. Verify now!",
            "Click here: http://malicious.xyz/login",
            "Good morning!",
            "Congratulations! You have won a prize.",
        ]
        for text in test_cases:
            result = classifier.predict(text)
            assert 0.0 <= result["probability"] <= 1.0, (
                f"Probability {result['probability']} out of range for: {text[:50]}"
            )

    def test_prediction_label_is_valid(self, classifier):
        """prediction must be exactly 'safe' or 'phishing'."""
        test_cases = [
            "Hey, are we still meeting for lunch at 12?",
            "URGENT! Your bank account has been suspended. Verify your OTP immediately.",
            "Your order has shipped.",
            "Win a free iPhone! Click now!",
            "Please share your OTP with our agent.",
        ]
        valid_labels = {"safe", "phishing"}
        for text in test_cases:
            result = classifier.predict(text)
            assert result["prediction"] in valid_labels, (
                f"Unexpected label '{result['prediction']}' for: {text[:50]}"
            )

    def test_high_confidence_on_obvious_phishing(self, classifier):
        """
        A very clear phishing message should have probability > 0.70.
        This is a soft threshold — we want the model to be decisive.
        """
        result = classifier.predict(
            "URGENT! Your bank account has been suspended. "
            "Verify your OTP immediately to avoid permanent closure."
        )
        assert result["probability"] > 0.70, (
            f"Expected high confidence (>0.70) for obvious phishing, "
            f"got {result['probability']:.3f}"
        )

    def test_high_confidence_on_obvious_safe(self, classifier):
        """
        A clearly safe message should have probability > 0.70.
        """
        result = classifier.predict("Hey, are we still meeting for lunch at 12?")
        assert result["probability"] > 0.70, (
            f"Expected high confidence (>0.70) for obvious safe text, "
            f"got {result['probability']:.3f}"
        )


# ---------------------------------------------------------------------------
# 4. Edge cases — must not crash
# ---------------------------------------------------------------------------

class TestEdgeCases:
    def test_empty_string_does_not_crash(self, classifier):
        """Empty string must not raise an exception."""
        result = classifier.predict("")
        assert result is not None
        assert result["prediction"] in {"safe", "phishing"}
        assert 0.0 <= result["probability"] <= 1.0

    def test_whitespace_only_does_not_crash(self, classifier):
        """Whitespace-only input must not raise an exception."""
        result = classifier.predict("     ")
        assert result is not None
        assert result["prediction"] in {"safe", "phishing"}

    def test_none_input_does_not_crash(self, classifier):
        """None input must not raise an exception."""
        result = classifier.predict(None)  # type: ignore[arg-type]
        assert result is not None
        assert result["prediction"] in {"safe", "phishing"}

    def test_single_character_does_not_crash(self, classifier):
        """Single character input must not raise an exception."""
        result = classifier.predict("x")
        assert result is not None

    def test_very_long_input_does_not_crash(self, classifier):
        """Very long text (5000+ chars) must not raise an exception."""
        long_text = "This is a safe message. " * 250
        result = classifier.predict(long_text)
        assert result is not None
        assert 0.0 <= result["probability"] <= 1.0

    def test_special_characters_only_does_not_crash(self, classifier):
        """String with only special characters must not crash."""
        result = classifier.predict("!!! $$$ ### @@@")
        assert result is not None

    def test_unicode_text_does_not_crash(self, classifier):
        """Unicode/multilingual text must not crash."""
        result = classifier.predict("आपका खाता बंद कर दिया गया है")  # Hindi
        assert result is not None
        assert result["prediction"] in {"safe", "phishing"}

    def test_numbers_only_does_not_crash(self, classifier):
        """Numeric-only string must not crash."""
        result = classifier.predict("12345678901234567890")
        assert result is not None

    def test_model_ready_flag_is_bool(self, classifier):
        """model_ready must always be a boolean."""
        result = classifier.predict("test message")
        assert isinstance(result["model_ready"], bool)
