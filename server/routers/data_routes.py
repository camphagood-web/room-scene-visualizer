from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services.data_loader import get_data

router = APIRouter()

@router.get("/options")
def get_global_options():
    data = get_data()
    return {
        "roomTypes": data.get("roomTypes", []),
        "colorWheelOptions": data.get("colorWheelOptions", []),
        "aspectRatios": data.get("aspectRatios", []),
        "imageQualityOptions": data.get("imageQualityOptions", [])
    }

@router.get("/styles")
def get_styles():
    data = get_data()
    return data.get("styles", [])

@router.get("/architects")
def get_architects(styleId: Optional[str] = None):
    data = get_data()
    architects = data.get("architects", [])
    
    if styleId:
        return [a for a in architects if styleId in a["styleIds"]]
    
    return architects

@router.get("/designers")
def get_designers(styleId: Optional[str] = None):
    data = get_data()
    designers = data.get("designers", [])
    
    if styleId:
        return [d for d in designers if styleId in d["styleIds"]]
    
    return designers
