# Gallery

## Overview

The Gallery screen lets users browse generated images grouped by session, filter by parameters and date, and download selected images or entire sessions. A fullscreen lightbox supports navigation and regeneration.

## User Flows

- Browse images grouped by generation session
- Filter by room type, design style, and date range
- Select individual images for batch download
- Download an entire session
- Open images in fullscreen lightbox and navigate
- Regenerate using the same parameters

## Design Decisions

- Sessions are grouped with headers to keep context for each generation run
- Selection actions appear only when images are selected to reduce clutter
- Filters are kept in a single panel for quick adjustments
- Lightbox supports keyboard and button navigation for faster review

## Data Used

**Entities:** GenerationSession, GeneratedImage, FilterOptions, ActiveFilters, LightboxState, DownloadModalState

**From global model:** GenerationRequest, GeneratedImage, DesignStyle, Architect, Designer

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `Gallery` - Full gallery layout with filters, sessions, and modals
- `GalleryFilters` - Filter panel for date, room type, and style
- `SessionGroup` - Session header and image grid
- `ImageCard` - Image tile with selection and hover actions
- `Lightbox` - Fullscreen image viewer with navigation
- `DownloadModal` - Modal to name and confirm downloads

## Callback Props

| Callback | Description |
|----------|-------------|
| `onFilterChange` | Called when filters change |
| `onImageSelect` | Called when user selects an image |
| `onSessionSelect` | Called when user selects or deselects all images in a session |
| `onClearSelection` | Called when user clears all selections |
| `onImageView` | Called when user opens an image in the lightbox |
| `onLightboxPrev` | Called when user navigates to the previous image |
| `onLightboxNext` | Called when user navigates to the next image |
| `onLightboxClose` | Called when user closes the lightbox |
| `onDownloadSelected` | Called when user downloads selected images |
| `onDownloadSession` | Called when user downloads a full session |
| `onDownloadConfirm` | Called when user confirms the download filename |
| `onDownloadCancel` | Called when user cancels the download modal |
| `onRegenerate` | Called when user regenerates a prior session |
