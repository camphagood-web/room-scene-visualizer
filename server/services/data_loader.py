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

def load_data():
    try:
        # Load Room Creator Data
        room_df = pd.read_csv(ROOM_CREATOR_PATH)
        color_df = pd.read_csv(COLOR_PALETTES_PATH)
        
        styles = []
        architects_map = {} # id -> {id, name, styleIds: set()}
        designers_map = {}  # id -> {id, name, styleIds: set()}

        # 1. Process Styles
        for _, row in room_df.iterrows():
            style_name = row['Design Style']
            style_id = to_kebab(style_name)
            
            # Extract attributes from room_df
            # Note: The CSV column names need to differ based on strict CSV reading or flexible?
            # Using the names seen in previous view_file of loader
            # 'Representative Architects', 'Representative Interior Designers'
            
            styles.append({
                "id": style_id,
                "name": style_name,
                "mood": row.get('Mood', ''), # Assuming Mood is in room_creator or need to join?
                # Actually, Mood and Undertone and DesignerNote seen in Sample Data seem to match 
                # what was in the previous loader (from color_palettes or room_creator?)
                # Previous loader read 'Primary Regions' etc from room_df.
                # Sample data has 'mood', 'undertone', 'designerNote'.
                # Let's check color_df for these fields as the previous loader seemed to pull from both?
                # Actually previous loader pulled Regions/Elements from room_df.
                # And Mood/Undertone/Note from color_df *per color row*.
                # But DesignStyle object has ONE mood/undertone/note.
                # Let's try to grab unique meta from color_df if possible, or just use what we have.
                "undertone": "", 
                "designerNote": ""
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

        # 2. Enrich Styles from Color Palette Data (Mood, Undertone, Note)
        # We'll take the first occurrence for each style
        for _, row in color_df.iterrows():
            style_name = row['Design Style']
            style_id = to_kebab(style_name)
            
            # Find the style in our list
            for style in styles:
                if style["id"] == style_id:
                    # Update if empty
                    if not style.get("mood"): style["mood"] = row.get("Mood", "")
                    if not style.get("undertone"): style["undertone"] = row.get("Undertone", "")
                    # Note usually comes from 'Designer Note' column
                    if not style.get("designerNote"): style["designerNote"] = row.get("Designer Note", "")
                    break

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
            { "id": "bedroom", "name": "Bedroom" } # Added common one
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
            { "id": "standard", "name": "Standard", "description": "Faster generation" },
            { "id": "high", "name": "High", "description": "Enhanced detail" }
        ]

        return {
            "styles": styles,
            "architects": architects,
            "designers": designers,
            "roomTypes": room_types,
            "colorWheelOptions": color_wheel_options,
            "aspectRatios": aspect_ratios,
            "imageQualityOptions": image_quality_options
        }

    except Exception as e:
        print(f"Error loading data: {e}")
        return {
            "styles": [], "architects": [], "designers": [],
            "roomTypes": [], "colorWheelOptions": [], "aspectRatios": [], "imageQualityOptions": []
        }

# Singleton-ish access
_DATA_CACHE = None

def get_data():
    global _DATA_CACHE
    if _DATA_CACHE is None:
        _DATA_CACHE = load_data()
    return _DATA_CACHE
