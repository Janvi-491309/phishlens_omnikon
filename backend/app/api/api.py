from fastapi import APIRouter
from app.api.endpoints import health, detection

api_router = APIRouter()

# Include endpoint routers. Since the API prefix is configured at the app level, 
# these will be mounted relative to that prefix.
api_router.include_router(health.router)
api_router.include_router(detection.router)
