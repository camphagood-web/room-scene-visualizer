import sys
import os
sys.path.append(os.getcwd())

from services.data_loader import get_data, get_room_details, get_color_details, to_kebab

print("--- Debugging Data Loader ---")

# 1. Check Data Load
data = get_data()
print(f"Loaded {len(data['styles'])} styles.")
if data['styles']:
    print(f"First Style ID: {data['styles'][0]['id']}")
    print(f"First Style Name: {data['styles'][0]['name']}")

# 2. Check Room Details Lookup
style_id = "refined-southern-traditional"
room_id = "living-room"
print(f"\nLooking up Room Details for {style_id} / {room_id}...")
room_details = get_room_details(style_id, room_id)
print(f"Result: {room_details}")

# 3. Check Color Details Lookup
color_id = "light"
print(f"\nLooking up Color Details for {style_id} / {color_id}...")
color_details = get_color_details(style_id, color_id)
print(f"Result: {color_details}")

# 4. Check Kebab Logic
print(f"\nKebab Check: 'Refined Southern Traditional' -> '{to_kebab('Refined Southern Traditional')}'")
