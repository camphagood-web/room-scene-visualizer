from google import genai
from config import GOOGLE_API_KEY
import base64

client = genai.Client(api_key=GOOGLE_API_KEY)

model_id = "gemini-2.5-flash-image"

prompt = """Generate a photorealistic Living Room room scene.
Design Style: Refined Southern Traditional
Architect: Historical Concepts
Designer: Bunny Williams
Color Palette: Medium
Aspect Ratio: 1:1
High quality, detailed, architectural photography."""

print(f"Testing {model_id} with FULL PROMPT...")

try:
    response = client.models.generate_content(
        model=model_id,
        contents=prompt,
    )
    print("Call returned.")
    if hasattr(response, 'candidates') and response.candidates:
        print(f"Candidates: {len(response.candidates)}")
        found_image = False
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                print(f"Success! MIME: {part.inline_data.mime_type}")
                found_image = True
            if part.text:
                print(f"Text: {part.text}")
        
        if not found_image:
             print("Candidates returned but NO INLINE IMAGE data found.")
    else:
        print("No candidates.")
except Exception as e:
    print(f"ERROR: {e}")
