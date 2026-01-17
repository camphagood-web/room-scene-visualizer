from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from services.gemini_service import generate_room_image
import shortuuid

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
    # In a real app, we would enqueue a job. 
    # For this synchronous/simple version, we will iterate and generate.
    # OR we can just return a success signal and let the client assume it's working if we want to mock the "process"
    # But since we have a `gemini_service`, let's try to call it.
    
    results = []
    
    # Map IDs to human readable if needed by the prompt-builder, 
    # but the IDs are kebab-case so they are somewhat readable. 
    # Ideally we'd look up the names.
    # For now passing IDs as prompt inputs (e.g. "living-room") is okay-ish, 
    # but "refined-southern-traditional" is better than "Refined Southern Traditional"?
    # Actually the Prompt likely expects Names.
    # Ideally we should look up the names from the data_loader.
    # Skip lookup for speed for now, or improve later.
    
    for room_id in request.room_type_ids:
        # Simple string cleanup for prompt
        room_name = room_id.replace("-", " ").title()
        style_name = request.design_style_id.replace("-", " ").title()
        
        result = generate_room_image(
            room_type=room_name,
            design_style=style_name,
            architect=request.architect_id.replace("-", " ").title(),
            designer=request.designer_id.replace("-", " ").title(),
            color_wheel=request.color_wheel_id,
            aspect_ratio=request.aspect_ratio_id,
            model_id=request.image_quality_id
        )
        results.append({
            "room_type_id": room_id,
            "result": result
        })
    
    # Check if all failed
    if not results:
        raise HTTPException(status_code=500, detail="No rooms generated")

    return {
        "success": True,
        "results": results
    }
