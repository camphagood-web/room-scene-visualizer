#!/usr/bin/env python3
"""
Migration script: Convert base64 images in gallery_data.json to file storage.

Usage: python scripts/migrate_base64_to_files.py
"""

import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

SERVER_DIR = Path(__file__).parent.parent
sys.path.append(str(SERVER_DIR))

from services.image_storage import image_storage
GALLERY_FILE = SERVER_DIR / "gallery_data.json"
BACKUP_DIR = SERVER_DIR / "backups"


def parse_data_url(data_url: str):
    if not data_url.startswith("data:"):
        return None, None

    try:
        header, data = data_url.split(",", 1)
        mime = header.split(":")[1].split(";")[0]
        return data, mime
    except ValueError:
        return None, None


def migrate():
    if not GALLERY_FILE.exists():
        print(f"Gallery file not found: {GALLERY_FILE}")
        return

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    backup_name = f"gallery_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    backup_path = BACKUP_DIR / backup_name
    shutil.copy(GALLERY_FILE, backup_path)
    print(f"Backed up to {backup_path}")

    with open(GALLERY_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    sessions = data.get("sessions", [])
    total_images = 0
    migrated_images = 0

    for session in sessions:
        session_id = session.get("id")
        if not session_id:
            continue

        for image in session.get("images", []):
            total_images += 1
            url = image.get("url", "")
            if not isinstance(url, str) or not url.startswith("data:"):
                continue

            b64_data, mime = parse_data_url(url)
            if not b64_data:
                continue

            room_type_id = image.get("roomType", {}).get("id", "unknown")
            image_id = image.get("id", "unknown")

            try:
                new_url = image_storage.save_image(
                    session_id=session_id,
                    room_type_id=room_type_id,
                    image_id=image_id,
                    base64_data=b64_data,
                    mime_type=mime or "image/jpeg",
                )
                image["url"] = new_url
                migrated_images += 1
            except Exception as e:
                print(f"Error migrating {image_id}: {e}")

    with open(GALLERY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print("Migration complete!")
    print(f"Total images: {total_images}")
    print(f"Migrated: {migrated_images}")
    print(f"Skipped: {total_images - migrated_images}")
    print(f"Backup: {backup_path}")


if __name__ == "__main__":
    migrate()
