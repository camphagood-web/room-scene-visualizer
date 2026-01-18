import pandas as pd
import os
import re

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
ROOM_CREATOR_PATH = os.path.join(DATA_DIR, "room_creator.csv")
COLOR_PALETTES_PATH = os.path.join(DATA_DIR, "color_palettes.csv")

def to_kebab(s):
    if not isinstance(s, str):
        return ""
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

# Global cache to hold the processed data AND the raw lookups
_DATA_CACHE = None

def load_data():
    try:
        # Load Raw Data
        room_df = pd.read_csv(ROOM_CREATOR_PATH)
        color_df = pd.read_csv(COLOR_PALETTES_PATH)
        
        styles = []
        architects_map = {} 
        designers_map = {} 

        # 1. Process Styles
        for _, row in room_df.iterrows():
            style_name = row['Design Style']
            style_id = to_kebab(style_name)
            
            # Find metadata from color_df (first match)
            # We do this to get Mood/Undertone/Note for the frontend display
            mood = ""
            undertone = ""
            note = ""
            
            # Filter color_df for this style
            style_colors = color_df[color_df['Design Style'] == style_name]
            if not style_colors.empty:
                first_row = style_colors.iloc[0]
                mood = first_row.get('Mood', '')
                undertone = first_row.get('Undertone', '')
                note = first_row.get('Designer Note', '')

            styles.append({
                "id": style_id,
                "name": style_name,
                "mood": mood,
                "undertone": undertone,
                "designerNote": note
            })
            
            # Process Architects
            arch_str = str(row.get('Representative Architects', ''))
            for arch_raw in arch_str.split(';'):
                arch_name = arch_raw.strip()
                if not arch_name or arch_name.lower() == 'nan': continue
                arch_id = to_kebab(arch_name)
                
                if arch_id not in architects_map:
                    architects_map[arch_id] = {
                        "id": arch_id,
                        "name": arch_name,
                        "styleIds": set()
                    }
                architects_map[arch_id]["styleIds"].add(style_id)

            # Process Designers
            des_str = str(row.get('Representative Interior Designers', ''))
            for des_raw in des_str.split(';'):
                des_name = des_raw.strip()
                if not des_name or des_name.lower() == 'nan': continue
                des_id = to_kebab(des_name)
                
                if des_id not in designers_map:
                    designers_map[des_id] = {
                        "id": des_id,
                        "name": des_name,
                        "styleIds": set()
                    }
                designers_map[des_id]["styleIds"].add(style_id)

        # Convert sets to lists
        architects = [
            {**a, "styleIds": list(a["styleIds"])} 
            for a in architects_map.values()
        ]
        designers = [
            {**d, "styleIds": list(d["styleIds"])} 
            for d in designers_map.values()
        ]

        # Static Options
        room_types = [
            { "id": "living-room", "name": "Living Room" },
            { "id": "dining-room", "name": "Dining Room" },
            { "id": "kitchen", "name": "Kitchen" },
            { "id": "bathroom", "name": "Bathroom" },
            { "id": "bedroom", "name": "Bedroom" } 
        ]
        
        color_wheel_options = [
            { "id": "light", "name": "Light" },
            { "id": "medium", "name": "Medium" },
            { "id": "dark", "name": "Dark" }
        ]
        
        aspect_ratios = [
            { "id": "1:1", "name": "1:1", "description": "Square" },
            { "id": "4:3", "name": "4:3", "description": "Standard" },
            { "id": "16:9", "name": "16:9", "description": "Widescreen" }
        ]
        
        image_quality_options = [
            { "id": "1k", "name": "1K", "description": "Fastest generation" },
            { "id": "2k", "name": "2K", "description": "Balanced detail" },
            { "id": "4k", "name": "4K", "description": "Maximum detail" }
        ]

        # Store in cache structure
        return {
            "frontend_data": {
                "styles": styles,
                "architects": architects,
                "designers": designers,
                "roomTypes": room_types,
                "colorWheelOptions": color_wheel_options,
                "aspectRatios": aspect_ratios,
                "imageQualityOptions": image_quality_options
            },
            "raw_data": {
                "room_df": room_df,
                "color_df": color_df
            }
        }

    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def get_data():
    global _DATA_CACHE
    if _DATA_CACHE is None:
        _DATA_CACHE = load_data()
    return _DATA_CACHE["frontend_data"] if _DATA_CACHE else {
        "styles": [], "architects": [], "designers": [],
        "roomTypes": [], "colorWheelOptions": [], "aspectRatios": [], "imageQualityOptions": []
    }

ROOM_COLUMN_MAP = {
    "living-room": "Living Room (2M+)",
    "dining-room": "Dining Room (2M+)",
    "kitchen": "Kitchen (2M+)",
    "bathroom": "Bathroom (2M+)"
}

def get_room_details(style_id: str, room_type_id: str):
    global _DATA_CACHE
    if _DATA_CACHE is None: _DATA_CACHE = load_data()
    if not _DATA_CACHE: return {}

    room_df = _DATA_CACHE["raw_data"]["room_df"]
    
    # helper to match style
    # Assuming style_id is kebab case of 'Design Style' column
    # We iterate to find match
    row = None
    for _, r in room_df.iterrows():
        if to_kebab(r['Design Style']) == style_id:
            row = r
            break
            
    if row is None:
        return {}
        
    details = {
        "architectural_elements": row.get("Architectural elements for rooms", ""),
        "room_specifics": ""
    }
    
    col_name = ROOM_COLUMN_MAP.get(room_type_id)
    if col_name and col_name in row:
        details["room_specifics"] = row[col_name]
        
    return details

def get_color_details(style_id: str, intensity_id: str):
    """
    intensity_id: 'light', 'medium', 'dark'
    Returns a string dict or formatted string of colors
    """
    global _DATA_CACHE
    if _DATA_CACHE is None: _DATA_CACHE = load_data()
    if not _DATA_CACHE: return ""

    color_df = _DATA_CACHE["raw_data"]["color_df"]
    
    # Filter by style
    # We need to find rows where to_kebab(Design Style) == style_id
    # We can't just use vector operations easily with custom function, loop is fine for small data
    matching_rows = []
    for _, r in color_df.iterrows():
        if to_kebab(r['Design Style']) == style_id:
            matching_rows.append(r)
            
    if not matching_rows:
        return ""
        
    # Map intensity_id to CSV Column
    # id='light' -> Col='Light'
    col_name = intensity_id.title() # Light, Medium, Dark
    
    if col_name not in matching_rows[0]:
        return ""
        
    # Construct palette string
    # Expected categories: Dominant, Grounding, Accent
    palette_parts = []
    
    for r in matching_rows:
        category = r.get("Category", "")
        # clear " (60%)" etc from category if desired, or keep it
        # The prompt might benefit from "Dominant (60%): color"
        val = r.get(col_name, "")
        if val and isinstance(val, str):
            palette_parts.append(f"{category}: {val}")
            
    return "; ".join(palette_parts)
