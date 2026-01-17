import sys
import os

# Add server directory to path
sys.path.append(os.getcwd())

from services.gemini_service import generate_room_image

print("Testing Prompt Construction...")
result = generate_room_image(
    room_type_id="living-room",
    design_style_id="refined-southern-traditional",
    architect_id="historical-concepts",
    designer_id="bunny-williams",
    color_wheel_id="light",
    aspect_ratio_id="16:9",
    model_id="standard"
)

# We expect the prompt to be printed to stdout by the function.
