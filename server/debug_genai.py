from google import genai
from config import GOOGLE_API_KEY
import base64

client = genai.Client(api_key=GOOGLE_API_KEY)

model_id = "gemini-2.5-flash-image"

print(f"Testing {model_id} with generate_content...")

try:
    response = client.models.generate_content(
        model=model_id,
        contents="A small blue cube",
    )
    print("Call returned.")
    if hasattr(response, 'candidates'):
        print(f"Candidates: {len(response.candidates)}")
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                print(f"Success! MIME: {part.inline_data.mime_type}")
            if part.text:
                print(f"Text: {part.text}")
    else:
        print("No candidates.")
except Exception as e:
    print(f"ERROR: {e}")
