import json
import os
from typing import List, Dict, Optional
from datetime import datetime

GALLERY_DATA_FILE = "gallery_data.json"

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
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"sessions": []}

    def _save_data(self, data: Dict):
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)

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
