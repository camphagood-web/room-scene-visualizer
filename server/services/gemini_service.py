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

# Quality Mapping
QUALITY_CONFIG = {
    "1k": {"model": "gemini-2.5-flash-image", "image_size": "1K"},
    "2k": {"model": "gemini-3-pro-image-preview", "image_size": "2K"},
    "4k": {"model": "gemini-3-pro-image-preview", "image_size": "4K"},
}

def generate_room_image(
    room_type_id: str,
    design_style_id: str,
    architect_id: str,
    designer_id: str,
    color_wheel_id: str,
    aspect_ratio_id: str,
    model_id: str = "1k",
    flooring_type_id: str = None,
    floor_board_width_id: str = None
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

    # Aspect Ratio Logic (prompt hint + API config)
    ratio_map = {
        "1:1": "Square aspect ratio (1:1)",
        "4:3": "Standard landscape aspect ratio (4:3)",
        "16:9": "Wide cinematic aspect ratio (16:9)"
    }
    ratio_instruction = ratio_map.get(aspect_ratio_id, f"Aspect ratio ({aspect_ratio_id})")
    allowed_aspect_ratios = {
        "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"
    }
    if aspect_ratio_id in allowed_aspect_ratios:
        aspect_ratio = aspect_ratio_id
    else:
        print(f"Unknown aspect ratio '{aspect_ratio_id}', defaulting to 1:1")
        aspect_ratio = "1:1"

    # Flooring Specification (conditional)
    flooring_spec = ""
    if flooring_type_id == "wood" and floor_board_width_id:
        # Use exact language from width.txt
        width_map = {
            "3in": "Flooring (Critical): extra narrow, 3-inch wide planks",
            "6in": "Flooring (Critical): standard, 6-inch wide planks",
            "9in": "Flooring (Critical): Wide, 9-inch wide planks"
        }
        flooring_spec = width_map.get(floor_board_width_id, "")
    elif flooring_type_id:
        flooring_type_names = {
            "wood": "Hardwood",
            "tile": "Tile",
            "stone": "Stone",
            "concrete": "Polished Concrete"
        }
        flooring_name = flooring_type_names.get(flooring_type_id, flooring_type_id.title())
        flooring_spec = f"Flooring Specification: {flooring_name} flooring"

    # Prompt Construction
    flooring_section = f"\n{flooring_spec}\n" if flooring_spec else ""

    prompt = f"""Generate a photorealistic {room_name} interior.

Design Style: {style_name}
Mood: {mood}
Designer Note: {note}

Architectural Context:
{arch_elements}

Room Features:
{room_specifics}
{flooring_section}
Color Palette ({clean_name(color_wheel_id)} Scheme):
{color_details}

References:
Architect: {architect_name}
Designer: {designer_name}

Format: {ratio_instruction}
High quality, detailed, architectural photography, 8k resolution."""

    print("Gemini user prompt:\n" + prompt)

    quality_settings = QUALITY_CONFIG.get(model_id, QUALITY_CONFIG["1k"])
    target_model = quality_settings["model"]
    image_size = quality_settings["image_size"]
    
    # Try Generation
    if client:
        try:
            print(f"Generating with model: {target_model}")
            
            # Read System Prompt (fail fast if missing or unreadable)
            import pathlib
            current_file = pathlib.Path(__file__)
            server_root = current_file.parent.parent
            system_prompt_path = server_root / "data" / "system_prompt.txt"
            try:
                with open(system_prompt_path, "r", encoding="utf-8") as f:
                    system_instruction = f.read()
                print(f"Loaded system prompt from server/data ({len(system_instruction)} chars)")
                print("Gemini system prompt:\n" + system_instruction)
            except Exception as e:
                raise RuntimeError(f"System prompt load failed: {system_prompt_path} ({e})")

            print(f"Gemini image_config aspect_ratio: {aspect_ratio}, image_size: {image_size}")
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio,
                    image_size=image_size
                )
            )

            response = client.models.generate_content(
                model=target_model,
                contents=prompt,
                config=config
            )
            
            # Parse Response
            if response.candidates:
                for part in response.candidates[0].content.parts:
                    if part.inline_data:
                        import base64
                        b64_data = base64.b64encode(part.inline_data.data).decode("utf-8")
                        mime = part.inline_data.mime_type or "image/jpeg"

                        return {
                            "success": True,
                            "base64_data": b64_data,
                            "mime_type": mime,
                            "model_used": target_model,
                            "prompt": prompt,
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
