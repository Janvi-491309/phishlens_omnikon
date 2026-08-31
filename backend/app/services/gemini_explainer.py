"""Optional Gemini-backed explanations for completed message assessments."""

import json
import logging
import os
from typing import Any, List, Optional

try:
    from google import genai
    from google.genai import types
except ImportError:  # Keep the API available until the optional SDK is installed.
    genai = None
    types = None


logger = logging.getLogger(__name__)


class GeminiExplainer:
    """Generate explanations only; scoring remains entirely deterministic."""

    DEFAULT_MODEL = "gemini-3.6-flash"

    def __init__(self, client: Optional[Any] = None) -> None:
        # Supplying a client is intentionally supported for focused unit tests.
        self._client = client

    @staticmethod
    def _fallback(risk_score: float, risk_level: str, findings: List[str]) -> str:
        if not findings:
            return "No suspicious indicators were detected in the message. It appears to be safe."
        return (
            f"This message was classified as {risk_level} with a risk score of {risk_score}/100. "
            f"It triggered the following indicators: {', '.join(findings)}."
        )

    def _get_client(self) -> Optional[Any]:
        if self._client is not None:
            return self._client

        # Never make real external requests from the test suite. Tests that need
        # Gemini behavior inject a mocked client explicitly.
        if os.getenv("PYTEST_CURRENT_TEST"):
            return None

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or genai is None or types is None:
            return None

        try:
            try:
                timeout_ms = max(1, int(os.getenv("GEMINI_TIMEOUT_MS", "10000")))
            except ValueError:
                timeout_ms = 10000
            return genai.Client(
                api_key=api_key,
                http_options=types.HttpOptions(timeout=timeout_ms),
            )
        except Exception:
            logger.warning("Gemini client initialization failed; using deterministic explanation.")
            return None

    def explain(
        self,
        content_type: str,
        raw_content: str,
        findings: List[str],
        risk_score: float,
        risk_level: str,
    ) -> str:
        """Return a concise Gemini explanation or the deterministic fallback."""
        fallback = self._fallback(risk_score, risk_level, findings)
        client = self._get_client()
        if client is None:
            return fallback

        prompt_data = {
            "content_type": content_type,
            "original_message": raw_content,
            "findings": findings,
            "final_risk_score": risk_score,
            "final_risk_level": risk_level,
        }
        prompt = (
            "Write a concise, user-friendly security explanation using only the supplied "
            "assessment data. Do not invent findings, recalculate the score, change the risk "
            "level, or provide dangerous instructions. State the supplied risk level and score "
            "accurately. Return plain text only.\n\n"
            f"Assessment data:\n{json.dumps(prompt_data, ensure_ascii=False)}"
        )

        try:
            response = client.models.generate_content(
                model=os.getenv("GEMINI_MODEL", self.DEFAULT_MODEL),
                contents=prompt,
            )
            explanation = getattr(response, "text", None)
            if not isinstance(explanation, str) or not explanation.strip():
                logger.warning("Gemini returned an empty or invalid explanation; using fallback.")
                return fallback
            return explanation.strip()
        except Exception:
            # Do not include request data or exception details: either could
            # inadvertently expose sensitive message content or credentials.
            logger.warning("Gemini explanation request failed; using deterministic explanation.")
            return fallback


gemini_explainer = GeminiExplainer()
