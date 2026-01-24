from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from services.gemini_service import generate_room_image
from services.gallery_service import gallery_service
from services.image_storage import image_storage
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
    flooring_type_id: Optional[str] = None
    floor_board_width_id: Optional[str] = None

class GenerationResponse(BaseModel):
    job_id: str
    status: str
    results: List[dict] = []

@router.post("/generate")
async def generate_images(request: GenerateRequest):    
    results = []
    generated_images = []
    session_id = str(uuid.uuid4())
    
    # Helper to format names nicely
    def format_name(kebab_id):
        return kebab_id.replace("-", " ").title()

    style_name = format_name(request.design_style_id)
    architect_name = format_name(request.architect_id)
    designer_name = format_name(request.designer_id)

    for room_id in request.room_type_ids:
        room_name = format_name(room_id)
        image_id = str(uuid.uuid4())
        
        try:
            # generate_room_image returns base64 + mime data for storage
            response_data = generate_room_image(
                room_type_id=room_id,
                design_style_id=request.design_style_id,
                architect_id=request.architect_id,
                designer_id=request.designer_id,
                color_wheel_id=request.color_wheel_id,
                aspect_ratio_id=request.aspect_ratio_id,
                model_id=request.image_quality_id,
                flooring_type_id=request.flooring_type_id,
                floor_board_width_id=request.floor_board_width_id
            )
            
            # Extract URL for internal storage (Gallery/Session) which expects a string
            if response_data.get("success"):
                try:
                    image_url = image_storage.save_image(
                        session_id=session_id,
                        room_type_id=room_id,
                        image_id=image_id,
                        base64_data=response_data.get("base64_data"),
                        mime_type=response_data.get("mime_type", "image/jpeg"),
                    )
                    api_result = {
                        "success": True,
                        "data": image_url,
                        "model_used": response_data.get("model_used"),
                        "prompt": response_data.get("prompt"),
                    }
                except Exception as e:
                    print(f"Failed to store {room_name}: {e}")
                    image_url = "https://placehold.co/1024x1024?text=Storage+Failed"
                    api_result = {
                        "success": False,
                        "error": "Image storage failed",
                        "prompt": response_data.get("prompt"),
                    }
            else:
                print(f"Failed to generate {room_name}: {response_data.get('error')}")
                image_url = "https://placehold.co/1024x1024?text=Generation+Failed"
                api_result = response_data

            # API Response: Frontend expects { result: { success, data, ... } }
            results.append({
                "room_type_id": room_id,
                "result": api_result
            })

            # Session Storage: Expects { url: "string_url" }
            generated_images.append({
                "id": image_id,
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
        "id": session_id,
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
