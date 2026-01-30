from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.image_storage import image_storage

router = APIRouter()


@router.get("/images/sessions/{session_id}/{filename}")
async def serve_image(session_id: str, filename: str):
    """
    Serve an image file from storage.
    """
    relative_url = f"/api/images/sessions/{session_id}/{filename}"
    file_path = image_storage.get_image_path(relative_url)

    if not file_path:
        raise HTTPException(status_code=404, detail="Image not found")

    ext = file_path.suffix.lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }
    media_type = media_types.get(ext, "image/jpeg")

    # CORS is handled by the global CORSMiddleware in main.py.
    headers = {"Cache-Control": "public, max-age=31536000"}

    return FileResponse(
        path=file_path,
        media_type=media_type,
        headers=headers,
    )
