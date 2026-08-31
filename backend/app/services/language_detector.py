"""Deterministic language detection for supported PhishLens message languages."""

import re
import unicodedata
from typing import Final, Optional


SUPPORTED_LANGUAGES: Final = {"en", "te", "te-Latn", "mixed"}
_TELUGU_RE: Final = re.compile(r"[\u0C00-\u0C7F]")
_LATIN_WORD_RE: Final = re.compile(r"[A-Za-z]{2,}")
_URL_RE: Final = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
_SECURITY_ABBREVIATIONS: Final = {"otp", "pin", "cvv", "ssn", "2fa"}


class LanguageDetector:
    """Classify only the small, explicitly supported language set.

    Romanized Telugu is intentionally phrase-based.  Latin-only messages stay
    English unless they contain one of these phishing-specific, curated forms.
    """

    ROMANIZED_PHISHING_PHRASES: Final = (
        "mee account",
        "mee khaata",
        "password pampandi",
        "otp pampandi",
        "verify cheyyandi",
        "verify cheyyali",
        "link open cheyyandi",
        "dabbu gelicharu",
        "prize gelicharu",
        "account block",
        "account suspend",
        "ventane verify",
        "ippude verify",
    )

    def detect(self, text: str, override: Optional[str] = None) -> str:
        """Return an override when supplied, otherwise resolve message language."""
        if override is not None:
            # Schema validation owns user-input validation; this check keeps the
            # service safe for direct callers as well.
            if override not in SUPPORTED_LANGUAGES:
                raise ValueError(f"Unsupported language: {override}")
            return override

        normalized = unicodedata.normalize("NFKC", text or "")
        telugu_count = len(_TELUGU_RE.findall(normalized))

        # Telugu with meaningful Latin words is code-mixed. URLs and common
        # security acronyms are shared signals, not English prose, so they do
        # not by themselves change a Telugu-script message to ``mixed``.
        if telugu_count:
            text_without_urls = _URL_RE.sub(" ", normalized)
            meaningful_latin_words = [
                word for word in _LATIN_WORD_RE.findall(text_without_urls)
                if word.casefold() not in _SECURITY_ABBREVIATIONS
            ]
            if meaningful_latin_words:
                return "mixed"
            return "te"

        folded = normalized.casefold()
        if any(self._contains_phrase(folded, phrase) for phrase in self.ROMANIZED_PHISHING_PHRASES):
            return "te-Latn"
        return "en"

    @staticmethod
    def _contains_phrase(text: str, phrase: str) -> bool:
        return re.search(rf"(?<![a-z]){re.escape(phrase)}(?![a-z])", text) is not None


language_detector = LanguageDetector()
