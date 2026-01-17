# Generator

## Overview

The Generator screen is the main interface for configuring and launching room scene generation. Users select parameters through card-based rows, review a summary of their selections, and trigger sequential generation with a segmented progress bar.

## User Flows

- Select one or more room types (multi-select)
- Select a design style (filters architects and designers)
- Select an architect and designer from filtered options
- Select color wheel, aspect ratio, and image quality
- Review selection summary and click Generate
- Watch progress segments update for each room type
- Auto-navigate to Gallery when generation completes

## Design Decisions

- Selection summary stays pinned at the top with a single primary Generate action
- Parameter groups use cards for fast scanning and clear selection states
- Architect and designer lists are disabled until a style is chosen to prevent invalid combinations
- Progress is displayed as segmented bars so users can track each room type

## Data Used

**Entities:** DesignStyle, Architect, Designer, RoomType, ColorWheelOption, AspectRatio, ImageQualityOption, GenerationProgress, GeneratorSelections

**From global model:** DesignStyle, Architect, Designer, GenerationRequest, GeneratedImage

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `Generator` - Full screen layout, selection summary, and parameter rows
- `SelectionSummary` - Summary chips and Generate button
- `SelectionCard` - Card-style selection buttons
- `ParameterSection` - Labeled wrapper for parameter rows
- `ProgressBar` - Segmented progress display for generation

## Callback Props

| Callback | Description |
|----------|-------------|
| `onRoomTypeToggle` | Called when user selects or deselects a room type |
| `onDesignStyleSelect` | Called when user selects a design style |
| `onArchitectSelect` | Called when user selects an architect |
| `onDesignerSelect` | Called when user selects a designer |
| `onColorWheelSelect` | Called when user selects a color wheel option |
| `onAspectRatioSelect` | Called when user selects an aspect ratio |
| `onImageQualitySelect` | Called when user selects an image quality option |
| `onGenerate` | Called when user clicks Generate |
