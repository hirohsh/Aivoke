"""
bedrock用のルーティングを定義する。
"""

from fastapi import APIRouter


router = APIRouter(prefix="/bedrock", tags=["Bedrock"])

@router.get("/status")
async def get_status() -> dict[str, str]:
    """
    Get the status of the Bedrock service.
    """
    return {"status": "ok"}
