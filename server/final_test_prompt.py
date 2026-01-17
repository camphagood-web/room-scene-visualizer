import sys
import os
sys.path.append(os.getcwd())
from services.gemini_service import generate_room_image

# Redirect stdout to a file with utf-8 encoding
f = open('final_test_output.txt', 'w', encoding='utf-8')
sys.stdout = f

try:
    result = generate_room_image(
        room_type_id="living-room",
        design_style_id="refined-southern-traditional",
        architect_id="historical-concepts",
        designer_id="bunny-williams",
        color_wheel_id="light",
        aspect_ratio_id="16:9",
        model_id="standard"
    )
    if 'prompt' in result:
        print(result['prompt'])
    else:
        print("Prompt not found in result keys: " + str(result.keys()))
finally:
    f.flush()
    f.close()
