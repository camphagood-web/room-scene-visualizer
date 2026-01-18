import json
import os
from typing import List, Dict, Optional
from datetime import datetime

GALLERY_DATA_FILE = "gallery_data.json"
VALID_COLOR_WHEELS = {"light", "medium", "dark"}
VALID_IMAGE_QUALITIES = {"1k", "2k", "4k"}

class GalleryService:
    def __init__(self, data_file: str = GALLERY_DATA_FILE):
        self.data_file = data_file
        self._ensure_data_file()

    def _ensure_data_file(self):
        if not os.path.exists(self.data_file):
            with open(self.data_file, 'w') as f:
                json.dump({"sessions": []}, f)

    def _load_data(self) -> Dict:
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            return self._sanitize_data(data)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"sessions": []}

    def _save_data(self, data: Dict):
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)

    def _sanitize_data(self, data: Dict) -> Dict:
        if not isinstance(data, dict):
            return {"sessions": []}

        sessions = data.get("sessions", [])
        if not isinstance(sessions, list):
            return {"sessions": []}

        valid_sessions = [s for s in sessions if self._is_valid_session(s)]

        if len(valid_sessions) != len(sessions):
            data["sessions"] = valid_sessions
            self._save_data(data)

        return data

    def _is_valid_session(self, session: Dict) -> bool:
        if not isinstance(session, dict):
            return False

        color_wheel = str(session.get("colorWheel", "")).strip().lower()
        image_quality = str(session.get("imageQuality", "")).strip().lower()

        if color_wheel not in VALID_COLOR_WHEELS:
            return False
        if image_quality not in VALID_IMAGE_QUALITIES:
            return False

        for key in ("designStyle", "architect", "designer"):
            obj = session.get(key, {})
            if not isinstance(obj, dict) or not obj.get("id"):
                return False

        images = session.get("images", [])
        if not isinstance(images, list) or not images:
            return False

        for image in images:
            if not isinstance(image, dict):
                return False
            if not isinstance(image.get("url"), str):
                return False
            room_type = image.get("roomType", {})
            if not isinstance(room_type, dict) or not room_type.get("id"):
                return False

        return True

    def get_sessions(self) -> List[Dict]:
        data = self._load_data()
        # Return sessions sorted by createdAt desc
        sessions = data.get("sessions", [])
        sessions.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        return sessions

    def get_session_by_id(self, session_id: str) -> Optional[Dict]:
        sessions = self.get_sessions()
        for session in sessions:
            if session["id"] == session_id:
                return session
        return None

    def add_session(self, session: Dict):
        data = self._load_data()
        if "sessions" not in data:
            data["sessions"] = []
        data["sessions"].append(session)
        self._save_data(data)

gallery_service = GalleryService()
