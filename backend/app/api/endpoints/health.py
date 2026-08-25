from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["System"])
def check_health():
    """
    Checks the status and health of the FastAPI application.
    """
    return {"status": "ok"}
