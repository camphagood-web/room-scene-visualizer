from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from services.gemini_service import generate_room_image
from services.gallery_service import gallery_service
import uuid
from datetime import datetime

router = APIRouter()

class GenerateRequest(BaseModel):
    room_type_ids: List[str]
    design_style_id: str
    architect_id: str
    designer_id: str
    color_wheel_id: str
    aspect_ratio_id: str
    image_quality_id: str

class GenerationResponse(BaseModel):
    job_id: str
    status: str
    results: List[dict] = []

@router.post("/generate")
async def generate_images(request: GenerateRequest):    
    results = []
    generated_images = []
    
    # Helper to format names nicely
    def format_name(kebab_id):
        return kebab_id.replace("-", " ").title()

    style_name = format_name(request.design_style_id)
    architect_name = format_name(request.architect_id)
    designer_name = format_name(request.designer_id)

    for room_id in request.room_type_ids:
        room_name = format_name(room_id)
        
        try:
            # generate_room_image returns a dict: { success, data, error, ... }
            response_data = generate_room_image(
                room_type_id=room_id,
                design_style_id=request.design_style_id,
                architect_id=request.architect_id,
                designer_id=request.designer_id,
                color_wheel_id=request.color_wheel_id,
                aspect_ratio_id=request.aspect_ratio_id,
                model_id=request.image_quality_id
            )
            
            # Extract URL for internal storage (Gallery/Session) which expects a string
            if response_data.get("success"):
                image_url = response_data.get("data")
            else:
                print(f"Failed to generate {room_name}: {response_data.get('error')}")
                image_url = "https://placehold.co/1024x1024?text=Generation+Failed"

            # API Response: Frontend expects { result: { success, data, ... } }
            results.append({
                "room_type_id": room_id,
                "result": response_data
            })

            # Session Storage: Expects { url: "string_url" }
            generated_images.append({
                "id": str(uuid.uuid4()),
                "roomType": {
                    "id": room_id,
                    "name": room_name
                },
                "url": image_url, # Ensure this is a string
                "selected": False
            })
            
        except Exception as e:
            print(f"Error generating {room_name}: {e}")
            # Continue with other rooms even if one fails
            continue
    
    if not results:
        raise HTTPException(status_code=500, detail="No rooms generated")

    # Create and save session
    quality_labels = {
        "1k": "1K",
        "2k": "2K",
        "4k": "4K"
    }
    image_quality_label = quality_labels.get(request.image_quality_id, request.image_quality_id)

    session = {
        "id": str(uuid.uuid4()),
        "createdAt": datetime.utcnow().isoformat() + "Z", # proper ISO format
        "designStyle": {
            "id": request.design_style_id,
            "name": style_name
        },
        "architect": {
            "id": request.architect_id,
            "name": architect_name
        },
        "designer": {
            "id": request.designer_id,
            "name": designer_name
        },
        "colorWheel": request.color_wheel_id, # Assumes valid value passed 'Light'|'Medium'|'Dark'
        "aspectRatio": request.aspect_ratio_id.replace(":", ":"), # careful if format differs
        "imageQuality": image_quality_label,
        "images": generated_images
    }

    gallery_service.add_session(session)

    return {
        "success": True,
        "results": results
    }
