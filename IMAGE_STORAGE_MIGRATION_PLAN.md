# Image Storage Migration Plan

## Overview

Migrate from base64-encoded images stored in JSON to file-system storage with JSON metadata. This improves performance, reduces memory usage, and enables easy future migration to cloud storage.

---

## Current State

| Component | Current Implementation |
|-----------|----------------------|
| Image Storage | Base64 data URIs embedded in `server/gallery_data.json` (256 MB) |
| Image Format | `data:image/jpeg;base64,{encoded_data}` |
| Generation | `gemini_service.py` returns base64 from Gemini API |
| Persistence | `gallery_service.py` saves entire session with embedded images |
| Serving | JSON returned directly to client via `/api/gallery/sessions` |

---

## Target State

| Component | New Implementation |
|-----------|-------------------|
| Image Storage | JPEG files in `server/images/sessions/{session-id}/` |
| URL Format | `/api/images/sessions/{session-id}/{room-type}-{image-id}.jpg` |
| Metadata | `gallery_data.json` stores only metadata (~1 MB) |
| Serving | New `/api/images/{path}` endpoint serves static files |

---

## File Structure

```
server/
├── images/
│   └── sessions/
│       ├── abc123-def456/
│       │   ├── living-room-001.jpg
│       │   ├── bedroom-002.jpg
│       │   └── kitchen-003.jpg
│       └── xyz789-uvw012/
│           └── bathroom-001.jpg
├── gallery_data.json          # Metadata only (no base64)
├── main.py
├── services/
│   ├── gallery_service.py     # Modified
│   ├── gemini_service.py      # Modified
│   └── image_storage.py       # NEW
└── routers/
    ├── gallery_routes.py
    ├── generate_routes.py     # Modified
    └── image_routes.py        # NEW
```

---

## Implementation Steps

### Step 1: Create Image Storage Service

**File:** `server/services/image_storage.py` (NEW)

```python
import os
import base64
import uuid
from pathlib import Path
from typing import Optional

# Image storage root directory
IMAGES_DIR = Path(__file__).parent.parent / "images" / "sessions"

class ImageStorageService:
    def __init__(self, base_dir: Path = IMAGES_DIR):
        self.base_dir = base_dir
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
        mime_type: str = "image/jpeg"
    ) -> str:
        """
        Save a base64-encoded image to disk.

        Args:
            session_id: UUID of the generation session
            room_type_id: Room type identifier (e.g., "living-room")
            image_id: Unique image identifier
            base64_data: Base64-encoded image data (without data URI prefix)
            mime_type: MIME type of the image

        Returns:
            Relative URL path for the saved image (e.g., "/api/images/sessions/abc/living-room-001.jpg")
        """
        # Create session directory
        session_dir = self.base_dir / session_id
        session_dir.mkdir(exist_ok=True)

        # Determine file extension from MIME type
        ext_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }
        ext = ext_map.get(mime_type, ".jpg")

        # Generate filename
        filename = f"{room_type_id}-{image_id[:8]}{ext}"
        file_path = session_dir / filename

        # Decode and save
        image_bytes = base64.b64decode(base64_data)
        with open(file_path, "wb") as f:
            f.write(image_bytes)

        # Return relative API URL (not filesystem path)
        return f"/api/images/sessions/{session_id}/{filename}"

    def get_image_path(self, relative_url: str) -> Optional[Path]:
        """
        Convert an API URL to a filesystem path.

        Args:
            relative_url: URL like "/api/images/sessions/abc/image.jpg"

        Returns:
            Filesystem Path object, or None if invalid
        """
        # Strip the API prefix
        prefix = "/api/images/sessions/"
        if not relative_url.startswith(prefix):
            return None

        relative_path = relative_url[len(prefix):]
        full_path = self.base_dir / relative_path

        # Security: Ensure path is within images directory
        try:
            full_path.resolve().relative_to(self.base_dir.resolve())
        except ValueError:
            return None  # Path traversal attempt

        return full_path if full_path.exists() else None

    def delete_session_images(self, session_id: str) -> bool:
        """Delete all images for a session."""
        session_dir = self.base_dir / session_id
        if session_dir.exists():
            import shutil
            shutil.rmtree(session_dir)
            return True
        return False

# Singleton instance
image_storage = ImageStorageService()
```

---

### Step 2: Create Image Serving Route

**File:** `server/routers/image_routes.py` (NEW)

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.image_storage import image_storage

router = APIRouter()

@router.get("/images/sessions/{session_id}/{filename}")
async def serve_image(session_id: str, filename: str):
    """
    Serve an image file from storage.

    This endpoint enables future migration to cloud storage by
    providing a consistent URL pattern that can be redirected.
    """
    relative_url = f"/api/images/sessions/{session_id}/{filename}"
    file_path = image_storage.get_image_path(relative_url)

    if not file_path or not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    # Determine media type from extension
    ext = file_path.suffix.lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp"
    }
    media_type = media_types.get(ext, "image/jpeg")

    return FileResponse(
        path=file_path,
        media_type=media_type,
        headers={"Cache-Control": "public, max-age=31536000"}  # 1 year cache
    )
```

---

### Step 3: Modify Gemini Service

**File:** `server/services/gemini_service.py`

**Change:** Return raw base64 data separately from MIME type instead of a complete data URI.

**Location:** Lines 156-168

**Before:**
```python
if part.inline_data:
    import base64
    b64_data = base64.b64encode(part.inline_data.data).decode('utf-8')
    mime = part.inline_data.mime_type or "image/jpeg"
    data_url = f"data:{mime};base64,{b64_data}"

    return {
        "success": True,
        "data": data_url,
        "model_used": target_model,
        "prompt": prompt
    }
```

**After:**
```python
if part.inline_data:
    import base64
    b64_data = base64.b64encode(part.inline_data.data).decode('utf-8')
    mime = part.inline_data.mime_type or "image/jpeg"

    return {
        "success": True,
        "base64_data": b64_data,      # Raw base64 (no prefix)
        "mime_type": mime,             # Separate MIME type
        "model_used": target_model,
        "prompt": prompt
    }
```

---

### Step 4: Modify Generate Routes

**File:** `server/routers/generate_routes.py`

**Change:** Save images to disk and store URL references instead of base64.

**Add import at top:**
```python
from services.image_storage import image_storage
```

**Location:** Lines 40-79 (inside the for loop)

**Before:**
```python
if response_data.get("success"):
    image_url = response_data.get("data")
else:
    print(f"Failed to generate {room_name}: {response_data.get('error')}")
    image_url = "https://placehold.co/1024x1024?text=Generation+Failed"

# ... rest of loop ...

generated_images.append({
    "id": str(uuid.uuid4()),
    "roomType": {
        "id": room_id,
        "name": room_name
    },
    "url": image_url,
    "selected": False
})
```

**After:**
```python
image_id = str(uuid.uuid4())

if response_data.get("success"):
    # Save image to disk and get URL
    image_url = image_storage.save_image(
        session_id=session_id,  # Define session_id before the loop
        room_type_id=room_id,
        image_id=image_id,
        base64_data=response_data.get("base64_data"),
        mime_type=response_data.get("mime_type", "image/jpeg")
    )
else:
    print(f"Failed to generate {room_name}: {response_data.get('error')}")
    image_url = "https://placehold.co/1024x1024?text=Generation+Failed"

# ... rest of loop ...

generated_images.append({
    "id": image_id,
    "roomType": {
        "id": room_id,
        "name": room_name
    },
    "url": image_url,
    "selected": False
})
```

**Also add before the for loop (around line 39):**
```python
# Generate session ID upfront so images can be organized by session
session_id = str(uuid.uuid4())
```

**And update the session creation (around line 98) to use the pre-generated ID:**
```python
session = {
    "id": session_id,  # Use pre-generated ID
    # ... rest unchanged ...
}
```

---

### Step 5: Register Image Router

**File:** `server/main.py`

**Add import:**
```python
from routers import data_routes, generate_routes, gallery_routes, image_routes
```

**Add router (after line 26):**
```python
app.include_router(image_routes.router, prefix="/api")
```

---

### Step 6: Create Migration Script (Optional)

**File:** `server/scripts/migrate_base64_to_files.py` (NEW)

This script migrates existing base64 images in `gallery_data.json` to files.

```python
#!/usr/bin/env python3
"""
Migration script: Convert base64 images in gallery_data.json to file storage.

Usage: python migrate_base64_to_files.py

This script:
1. Reads gallery_data.json
2. Extracts base64 images and saves them as files
3. Updates URLs to point to the new file locations
4. Backs up the original file and writes the updated version
"""

import json
import base64
import os
import shutil
from pathlib import Path
from datetime import datetime

# Paths
SCRIPT_DIR = Path(__file__).parent
SERVER_DIR = SCRIPT_DIR.parent
GALLERY_FILE = SERVER_DIR / "gallery_data.json"
IMAGES_DIR = SERVER_DIR / "images" / "sessions"
BACKUP_DIR = SERVER_DIR / "backups"

def parse_data_url(data_url: str) -> tuple[str, str, str]:
    """
    Parse a data URL into components.

    Returns: (base64_data, mime_type, extension)
    """
    if not data_url.startswith("data:"):
        return None, None, None

    # Format: data:image/jpeg;base64,/9j/4AAQ...
    header, data = data_url.split(",", 1)
    mime = header.split(":")[1].split(";")[0]

    ext_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }
    ext = ext_map.get(mime, ".jpg")

    return data, mime, ext

def migrate():
    print(f"Starting migration at {datetime.now().isoformat()}")

    # Create directories
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    # Backup original file
    backup_name = f"gallery_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    backup_path = BACKUP_DIR / backup_name
    shutil.copy(GALLERY_FILE, backup_path)
    print(f"Backed up to {backup_path}")

    # Load data
    with open(GALLERY_FILE, "r") as f:
        data = json.load(f)

    sessions = data.get("sessions", [])
    total_images = 0
    migrated_images = 0

    for session in sessions:
        session_id = session.get("id")
        if not session_id:
            continue

        session_dir = IMAGES_DIR / session_id

        for image in session.get("images", []):
            total_images += 1
            url = image.get("url", "")

            # Skip if already migrated (not a data URL)
            if not url.startswith("data:"):
                print(f"  Skipping {image.get('id')} - already migrated")
                continue

            # Parse data URL
            b64_data, mime, ext = parse_data_url(url)
            if not b64_data:
                print(f"  Skipping {image.get('id')} - invalid data URL")
                continue

            # Create session directory
            session_dir.mkdir(exist_ok=True)

            # Generate filename
            room_type = image.get("roomType", {}).get("id", "unknown")
            image_id = image.get("id", "unknown")[:8]
            filename = f"{room_type}-{image_id}{ext}"
            file_path = session_dir / filename

            # Save image
            try:
                image_bytes = base64.b64decode(b64_data)
                with open(file_path, "wb") as f:
                    f.write(image_bytes)

                # Update URL in session data
                new_url = f"/api/images/sessions/{session_id}/{filename}"
                image["url"] = new_url
                migrated_images += 1
                print(f"  Migrated: {filename}")

            except Exception as e:
                print(f"  Error migrating {image.get('id')}: {e}")

    # Save updated gallery data
    with open(GALLERY_FILE, "w") as f:
        json.dump(data, f, indent=2)

    # Summary
    print(f"\nMigration complete!")
    print(f"  Total images: {total_images}")
    print(f"  Migrated: {migrated_images}")
    print(f"  Skipped: {total_images - migrated_images}")
    print(f"  Original backup: {backup_path}")
    print(f"  New gallery_data.json size: {GALLERY_FILE.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    migrate()
```

---

## Testing & Verification

### 1. Unit Tests

After implementation, verify:

```bash
# Test image storage service
cd server
python -c "
from services.image_storage import image_storage
import base64

# Test save
test_data = base64.b64encode(b'fake image data').decode()
url = image_storage.save_image('test-session', 'living-room', 'img001', test_data)
print(f'Saved to: {url}')

# Test retrieve
path = image_storage.get_image_path(url)
print(f'File exists: {path.exists() if path else False}')

# Cleanup
image_storage.delete_session_images('test-session')
print('Test passed!')
"
```

### 2. Integration Test

1. Start the server: `python main.py`
2. Generate a new room image via the UI
3. Check that:
   - Image file exists in `server/images/sessions/{session-id}/`
   - `gallery_data.json` contains URL path (not base64)
   - Image loads correctly in gallery view
4. Verify the image URL format: `/api/images/sessions/{session-id}/{filename}.jpg`

### 3. Migration Test

1. Backup `gallery_data.json` manually
2. Run migration script: `python scripts/migrate_base64_to_files.py`
3. Verify:
   - Original file backed up in `server/backups/`
   - Images extracted to `server/images/sessions/`
   - `gallery_data.json` now contains URL paths
   - File size reduced from ~256 MB to ~1 MB
   - Gallery still displays all images correctly

---

## Client-Side Changes (Minimal)

The client code should work without changes because:

1. **Gallery display**: Already uses the `url` field from API response
2. **Download logic**: `useGallery.ts` already handles both data URLs and HTTP URLs (lines 220-227)

However, verify that the download function correctly fetches from the new URLs.

---

## Future Server Migration Notes

When migrating to cloud hosting:

1. **Storage**: Replace `ImageStorageService` with S3/GCS implementation
2. **URLs**: Either:
   - Redirect `/api/images/*` to CDN
   - Or update URLs to point directly to CDN (e.g., `https://cdn.example.com/images/...`)
3. **No client changes needed** if you keep the same URL pattern

---

## Summary of Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `server/services/image_storage.py` | CREATE | Image storage service |
| `server/routers/image_routes.py` | CREATE | Image serving endpoint |
| `server/scripts/migrate_base64_to_files.py` | CREATE | Migration script |
| `server/services/gemini_service.py` | MODIFY | Return raw base64 + mime type |
| `server/routers/generate_routes.py` | MODIFY | Save images to disk |
| `server/main.py` | MODIFY | Register image router |

---

## Execution Order

1. Create `server/images/sessions/` directory
2. Create `server/services/image_storage.py`
3. Create `server/routers/image_routes.py`
4. Modify `server/main.py` to register new router
5. Modify `server/services/gemini_service.py`
6. Modify `server/routers/generate_routes.py`
7. Test new image generation
8. Create and run migration script for existing images
9. Verify gallery functionality
