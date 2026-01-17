from google import genai
from google.genai import types
from config import GOOGLE_API_KEY
import base64

client = genai.Client(api_key=GOOGLE_API_KEY)

models = ["gemini-2.5-flash-image", "gemini-3-pro-image-preview"]

for model in models:
    print(f"\nTesting {model}...")
    try:
        response = client.models.generate_content(
            model=model,
            contents="A small blue cube",
            config=types.GenerateContentConfig(
                response_mime_type="image/png"
            )
        )
        print("Call returned.")
        if hasattr(response, 'candidates'):
             for cand in response.candidates:
                 for part in cand.content.parts:
                     if part.inline_data:
                         print(f"Success! Got inline data. Mime: {part.inline_data.mime_type}")
                         # This would be the image
                     if part.text:
                         print(f"Got text: {part.text}")
    except Exception as e:
        print(f"Failed: {e}")
