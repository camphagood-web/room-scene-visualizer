# Design Room Generator Product Overview

## Summary

A web application that generates AI-powered interior room scenes using Google's Gemini API (Nano Banana models). Users select design parameters through a multi-select interface, and the app constructs prompts to generate photorealistic room visualizations in their chosen architectural and design style.

## Planned Sections

1. **Generator** - The main interface combining parameter selection (room types, design styles, architects, designers, color wheel, aspect ratio), model and settings controls, and a visual progress area showing images as they generate sequentially.
2. **Gallery** - Viewing generated images, browsing generation history, downloading results, and options to regenerate with the same or modified parameters.

## Data Model

- DesignStyle
- Architect
- Designer
- GenerationRequest
- GeneratedImage

## Design System

**Colors:**
- Primary: amber
- Secondary: cyan
- Neutral: stone

**Typography:**
- Heading: DM Sans
- Body: DM Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** - Set up design tokens, data model types, and application shell
2. **Generator** - Parameter selection and sequential generation UI
3. **Gallery** - Session-based browsing, filters, downloads, and lightbox

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
