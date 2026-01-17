from google import genai
from google.genai import types
from config import GOOGLE_API_KEY
import base64

if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found.")
    exit(1)

client = genai.Client(api_key=GOOGLE_API_KEY)
model_id = "imagen-3.0-generate-001"

def test_aspect_ratio(ratio: str):
    print(f"\nTesting aspect ratio: {ratio}")
    try:
        response = client.models.generate_image(
            model=model_id,
            prompt="A geometric composition",
            config=types.GenerateImageConfig(
                number_of_images=1,
                aspect_ratio=ratio
            )
        )
        
        if hasattr(response, 'generated_images') and response.generated_images:
            img = response.generated_images[0]
            print("Success!")
            if img.image.url:
                print(f"URL: {img.image.url}")
            if img.image.b64_json:
                print("Has b64_json")
            if img.image.bytes: # Hypothetical check
                 print("Has bytes")
        else:
            print("No images generated.")
            
    except Exception as e:
        print(f"Failed: {e}")

test_aspect_ratio("1:1")
test_aspect_ratio("16:9")
test_aspect_ratio("4:3")
