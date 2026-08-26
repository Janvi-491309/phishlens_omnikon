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

def test_analyze_url_safe():
    # https://www.google.com should be SAFE (0 score)
    payload = {"url": "https://www.google.com"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == payload["url"]
    assert data["risk_score"] == 0.0
    assert data["risk_level"] == "SAFE"
    assert data["is_suspicious"] is False
    assert len(data["findings"]) == 0
    assert "safe" in data["explanation"].lower()

def test_analyze_url_suspicious():
    # http://example.com/login/verify should be SUSPICIOUS
    # HTTP (+15) + login (+15) + verify (+15) = 45.0
    payload = {"url": "http://example.com/login/verify"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == payload["url"]
    assert data["risk_score"] == 45.0
    assert data["risk_level"] == "SUSPICIOUS"
    assert data["is_suspicious"] is True
    assert len(data["findings"]) == 3
    assert "suspicious" in data["explanation"].lower()

def test_analyze_url_high():
    # http://192.168.1.100/login/verify?password=update should be HIGH
    # HTTP (+15) + IP (+25) + login (+15) + verify (+15) + password (+15) + update (+15) = 100.0 (capped)
    payload = {"url": "http://192.168.1.100/login/verify?password=update"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == payload["url"]
    assert data["risk_score"] == 100.0
    assert data["risk_level"] == "HIGH"
    assert data["is_suspicious"] is True
    assert len(data["findings"]) == 6
    assert "high" in data["explanation"].lower()

def test_analyze_url_invalid():
    # Test missing protocol
    payload = {"url": "www.google.com"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 422
    
    # Test completely malformed url
    payload = {"url": "not_a_valid_url"}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 422
    
    # Test empty url
    payload = {"url": ""}
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 422
