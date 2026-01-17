# Data Model

## Entities

- **DesignStyle**: Curated interior design style with mood, undertone, and color palette data (light/medium/dark) for dominant, grounding, and accent colors.
- **Architect**: Representative architect associated with one or more design styles.
- **Designer**: Interior designer associated with one or more design styles.
- **GenerationRequest**: A generation job capturing selected parameters (room types, style, architect, designer, color wheel, aspect ratio, image quality).
- **GeneratedImage**: A single image output linked to its generation request and a specific room type.

## Relationships

- DesignStyle has many Architects
- DesignStyle has many Designers
- Architect belongs to one or more DesignStyles
- Designer belongs to one or more DesignStyles
- GenerationRequest has one DesignStyle
- GenerationRequest has one Architect
- GenerationRequest has one Designer
- GenerationRequest has many GeneratedImages (one per room type selected)
- GeneratedImage belongs to one GenerationRequest
