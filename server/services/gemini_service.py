from google import genai
from google.genai import types
from config import GOOGLE_API_KEY
import os
from services.data_loader import get_data, get_room_details, get_color_details
import time

# Configure Gemini Client (v1beta/v0.8+ SDK)
if GOOGLE_API_KEY:
    client = genai.Client(api_key=GOOGLE_API_KEY)
else:
    print("Gemini API Key missing")
    client = None

# Model Mapping
MODEL_MAP = {
    "standard": "gemini-2.5-flash-image",
    "high": "gemini-3-pro-image-preview", # hypothetical, assuming better model for high quality
}

def generate_room_image(
    room_type_id: str,
    design_style_id: str,
    architect_id: str,
    designer_id: str,
    color_wheel_id: str,
    aspect_ratio_id: str,
    model_id: str = "standard"
):
    # Data Lookup
    all_data = get_data()
    style_obj = next((s for s in all_data['styles'] if s['id'] == design_style_id), None)
    
    def clean_name(s): return s.replace('-', ' ').title()

    style_name = style_obj['name'] if style_obj else clean_name(design_style_id)
    mood = style_obj['mood'] if style_obj else ""
    note = style_obj['designerNote'] if style_obj else ""
    
    room_details = get_room_details(design_style_id, room_type_id)
    arch_elements = room_details.get('architectural_elements', '')
    room_specifics = room_details.get('room_specifics', '')
    
    color_details = get_color_details(design_style_id, color_wheel_id)
    
    room_name = clean_name(room_type_id)
    architect_name = clean_name(architect_id)
    designer_name = clean_name(designer_id)

    # Aspect Ratio Logic
    ratio_map = {
        "1:1": "Square aspect ratio (1:1)",
        "4:3": "Standard landscape aspect ratio (4:3)",
        "16:9": "Wide cinematic aspect ratio (16:9)"
    }
    ratio_instruction = ratio_map.get(aspect_ratio_id, "Standard Ratio")

    # Prompt Construction
    prompt = f"""Generate a photorealistic {room_name} interior.
    
Design Style: {style_name}
Mood: {mood}
Designer Note: {note}

Architectural Context:
{arch_elements}

Room Features:
{room_specifics}

Color Palette ({clean_name(color_wheel_id)} Scheme):
{color_details}

References:
Architect: {architect_name}
Designer: {designer_name}

Format: {ratio_instruction}
High quality, detailed, architectural photography, 8k resolution."""

    print(f"Generating with Prompt:\n{prompt}")

    # Determine Model ID
    # Use flash for everything unless 'high' is requested (if mapped)
    # Just reusing previous logic structure but simplified
    target_model = "gemini-2.5-flash-image"
    if model_id == "high":
         # Use a better model if available, or just same one for now
         target_model = "gemini-2.5-flash-image" 
    
    # Try Generation
    if client:
        try:
            print(f"Generating with model: {target_model}")
            
            # Read System Prompt
            import pathlib
            try:
                current_file = pathlib.Path(__file__)
                server_root = current_file.parent.parent
                system_prompt_path = server_root / "data" / "system_prompt.txt"
                
                with open(system_prompt_path, "r", encoding="utf-8") as f:
                    system_instruction = f.read()
                    print(f"Loaded system prompt from server/data ({len(system_instruction)} chars)")
            except Exception as e:
                print(f"Error reading system prompt: {e}")
                system_instruction = None

            config = None
            if system_instruction:
                config = types.GenerateContentConfig(system_instruction=system_instruction)

            response = client.models.generate_content(
                model=target_model,
                contents=prompt,
                config=config
            )
            
            # Parse Response
            if response.candidates:
                for part in response.candidates[0].content.parts:
                    if part.inline_data:
                        # Convert raw bytes to base64 data URL for frontend
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
                        
            print("No inline image data found in response.")
            
        except Exception as e:
            print(f"Model {target_model} failed: {e}")

    # Fallback to Placeholder
    print("Generation failed. Using Placeholder.")
    time.sleep(2) 
    return {
        "success": False,
        "error": "Generation API failed or returned no image.",
        "prompt": prompt
    }
