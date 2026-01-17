from google import genai
from google.genai import types
from config import GOOGLE_API_KEY

client = genai.Client(api_key=GOOGLE_API_KEY)
model_id = "gemini-2.5-flash-image"

print(f"Testing {model_id} with generate_images...")

try:
    response = client.models.generate_image(
        model=model_id,
        prompt="A small blue cube",
        config=types.GenerateImageConfig(number_of_images=1)
    )
    print("Call returned.")
    if hasattr(response, 'generated_images'):
        print(f"Generated Images: {len(response.generated_images)}")
        if response.generated_images:
             img = response.generated_images[0]
             print(f"Image URL: {img.image.url}")
except Exception as e:
    print(f"ERROR: {e}")
