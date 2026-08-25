from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_analyze_message_safe():
    # Clearly safe message with no indicators
    payload = {"text": "Hey, are we still meeting for lunch at 12?"}
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 0.0
    assert data["risk_level"] == "SAFE"
    assert len(data["findings"]) == 0
    assert "safe" in data["explanation"].lower()

def test_analyze_message_safe_brand_only():
    # Brand impersonation weak signal: normal message mentioning Amazon should remain SAFE (0 points)
    payload = {"text": "I ordered a book on Amazon yesterday."}
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 0.0
    assert data["risk_level"] == "SAFE"
    assert len(data["findings"]) == 0

def test_analyze_message_suspicious():
    # Urgency (20) + Credential request (25) = 45 (SUSPICIOUS)
    payload = {"text": "Please verify your credentials immediately."}
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 45.0
    assert data["risk_level"] == "SUSPICIOUS"
    assert len(data["findings"]) == 2

def test_analyze_message_high_risk():
    # Urgency (20) + Threat (20) + Credential request (25) + URL (20) + Impersonation (10) = 95 (HIGH)
    payload = {
        "text": "URGENT: Your Wells Fargo account is deactivated. Reset your password immediately at http://verify-bank.com"
    }
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 95.0
    assert data["risk_level"] == "HIGH"
    assert len(data["findings"]) == 5
    assert "high" in data["explanation"].lower()

def test_analyze_url():
    payload = {"url": "http://example.com/login"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert data["url"] == payload["url"]
    assert "is_suspicious" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert "findings" in data
    assert "explanation" in data
    assert data["is_suspicious"] is False  # Because it's currently a stub with no findings
