# PhishLens Backend

This is the FastAPI backend for PhishLens, a system for detecting phishing messages and suspicious URLs.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── health.py        # GET /api/health
│   │   │   └── detection.py     # POST /api/analyze/message, POST /api/analyze/url
│   │   ├── api.py               # Main router aggregation
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py                # Configuration and environment variables
│   │   └── __init__.py
│   ├── models/
│   │   ├── schemas.py               # Pydantic validation schemas
│   │   └── __init__.py
│   ├── services/
│   │   ├── message_analyzer.py      # Rule-based message analyzer
│   │   ├── url_analyzer.py          # String heuristic-based URL analyzer
│   │   ├── risk_engine.py           # Risk calculation logic
│   │   ├── ml_classifier.py         # ML-based classification engine
│   │   ├── gemini_explainer.py      # LLM-based explanation engine
│   │   └── __init__.py
│   ├── main.py                      # FastAPI app instance and middleware configuration
│   └── __init__.py
├── .gitignore                       # Python-specific gitignore
└── requirements.txt                 # Backend dependencies
```

## Setup Instructions

### 1. Create a Virtual Environment
From the `backend/` directory, run:
```bash
python -m venv .venv
```

### 2. Activate the Virtual Environment
- **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
- **macOS / Linux**:
  ```bash
  source .venv/bin/activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI Application
Start the development server with hot reload enabled:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

- **Interactive Docs (Swagger UI)**: `http://127.0.0.1:8000/api/docs`
- **Health Check**: `GET /api/health`
- **Analyze Message**: `POST /api/analyze/message`
  - Body: `{"message_content": "Your text here"}`
- **Analyze URL**: `POST /api/analyze/url`
  - Body: `{"url": "http://suspicious-site.com"}`
