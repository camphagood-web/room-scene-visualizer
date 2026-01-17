from google import genai
from config import GOOGLE_API_KEY

if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found.")
    exit(1)

client = genai.Client(api_key=GOOGLE_API_KEY)

try:
    print("Listing models...")
    # The SDK method might trigger pagination, but let's try to get the first page
    # Note: method signature might vary by SDK version, trying common pattern
    for model in client.models.list():
        print(f"Model: {model.name} - {model.display_name}")
except Exception as e:
    print(f"Error listing models: {e}")
