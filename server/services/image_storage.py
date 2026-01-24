import base64
import os
from pathlib import Path
from typing import Optional

SERVER_ROOT = Path(__file__).parent.parent
DEFAULT_IMAGES_DIR = SERVER_ROOT / "images" / "sessions"


def _resolve_base_dir() -> Path:
    env_value = os.getenv("IMAGE_STORAGE_DIR")
    if not env_value:
        return DEFAULT_IMAGES_DIR

    env_path = Path(env_value)
    if not env_path.is_absolute():
        env_path = SERVER_ROOT / env_path
    return env_path


class ImageStorageService:
    def __init__(self, base_dir: Optional[Path] = None):
        self.base_dir = base_dir or _resolve_base_dir()
        self._ensure_directory()

    def _ensure_directory(self):
        """Create images directory if it doesn't exist."""
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def save_image(
        self,
        session_id: str,
        room_type_id: str,
        image_id: str,
        base64_data: str,
        mime_type: str = "image/jpeg",
    ) -> str:
        """
        Save a base64-encoded image to disk.

        Returns:
            Relative API URL for the saved image.
        """
        if not base64_data:
            raise ValueError("base64_data is required to save an image")

        session_dir = self.base_dir / session_id
        session_dir.mkdir(exist_ok=True)

        ext_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
        }
        ext = ext_map.get(mime_type, ".jpg")

        filename = f"{room_type_id}-{image_id[:8]}{ext}"
        file_path = session_dir / filename

        image_bytes = base64.b64decode(base64_data)
        with open(file_path, "wb") as f:
            f.write(image_bytes)

        return f"/api/images/sessions/{session_id}/{filename}"

    def get_image_path(self, relative_url: str) -> Optional[Path]:
        """
        Convert an API URL to a filesystem path.
        """
        prefix = "/api/images/sessions/"
        if not relative_url.startswith(prefix):
            return None

        relative_path = relative_url[len(prefix):].lstrip("/")
        full_path = (self.base_dir / relative_path).resolve()

        try:
            full_path.relative_to(self.base_dir.resolve())
        except ValueError:
            return None

        return full_path if full_path.exists() else None

    def delete_session_images(self, session_id: str) -> bool:
        """Delete all images for a session."""
        session_dir = self.base_dir / session_id
        if session_dir.exists():
            import shutil

            shutil.rmtree(session_dir)
            return True
        return False


image_storage = ImageStorageService()
