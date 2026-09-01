import pytest
from pydantic import ValidationError

from app.models.schemas import MessageAnalysisRequest
from app.services.language_detector import language_detector


def test_detects_english_by_default():
    assert language_detector.detect("Please review the attached document.") == "en"


def test_detects_telugu_script():
    assert language_detector.detect("మీ ఖాతాను వెంటనే ధృవీకరించండి") == "te"


def test_detects_hindi_devanagari_script_without_misclassifying_telugu():
    assert language_detector.detect("अपने खाते को तुरंत सत्यापित करें") == "hi"
    assert language_detector.detect("మీ ఖాతాను వెంటనే ధృవీకరించండి") == "te"


def test_telugu_with_shared_otp_signal_stays_telugu():
    assert language_detector.detect("మీ ఖాతాను వెంటనే ధృవీకరించండి. OTP పంపండి") == "te"


def test_detects_telugu_english_code_mixing():
    assert language_detector.detect("మీ account ను వెంటనే verify చేయండి") == "mixed"


def test_detects_clear_romanized_telugu_phishing_phrase():
    assert language_detector.detect("Mee account verify cheyyandi ventane") == "te-Latn"


def test_ambiguous_latin_only_text_remains_english():
    assert language_detector.detect("Please verify the meeting agenda before tomorrow.") == "en"


def test_explicit_override_wins_over_detection():
    assert language_detector.detect("మీ ఖాతాను వెంటనే ధృవీకరించండి", "en") == "en"


def test_schema_rejects_invalid_language():
    with pytest.raises(ValidationError):
        MessageAnalysisRequest(text="hello", language="fr")
