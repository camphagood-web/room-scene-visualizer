# Milestone 3: Gallery

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete and Milestone 2 (Generator) complete

---

## About These Instructions

**What you are receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components - use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development - write tests first using `tests.md` instructions
- The components are props-based and ready to integrate - focus on the backend and data layer

---

## Goal

Implement the Gallery feature - browse generated images, filter sessions, view fullscreen, and download results.

## Overview

The Gallery screen groups images by generation session, supports filtering by date, room type, and design style, and provides selection tools for batch downloads. Users can open any image in a fullscreen lightbox with navigation and regenerate from prior sessions.

**Key Functionality:**
- Browse images grouped by generation session
- Filter by room type, design style, and date range
- Select images for batch download
- Download an entire session
- Open images in a lightbox with prev/next navigation
- Regenerate from an existing session

## Recommended Approach: Test-Driven Development

Before implementing this section, write tests first based on the test specifications provided.

See `product-plan/sections/gallery/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic - adapt them to your testing setup.

## What to Implement

### Components

Copy the section components from `product-plan/sections/gallery/components/`:

- `Gallery`
- `GalleryFilters`
- `SessionGroup`
- `ImageCard`
- `Lightbox`
- `DownloadModal`

### Data Layer

The components expect these data shapes:

- GenerationSession
- GeneratedImage
- FilterOptions
- ActiveFilters
- LightboxState
- DownloadModalState

You will need to:
- Create API endpoints or data fetching logic
- Connect real data to the components

### Callbacks

Wire up these user actions:

- `onFilterChange(filters)` - update active filters
- `onImageSelect(imageId)` - toggle image selection
- `onSessionSelect(sessionId, selected)` - select or deselect all images in a session
- `onClearSelection()` - clear selected images
- `onImageView(imageId)` - open an image in the lightbox
- `onLightboxPrev()` - show previous image
- `onLightboxNext()` - show next image
- `onLightboxClose()` - close the lightbox
- `onDownloadSelected()` - initiate download of selected images
- `onDownloadSession(sessionId)` - download an entire session
- `onDownloadConfirm(fileName)` - confirm download with a filename
- `onDownloadCancel()` - cancel the download modal
- `onRegenerate(sessionId)` - regenerate from a prior session

### Empty States

Implement empty state UI for when no records exist or filters return nothing:

- **No sessions yet:** Show "No images found" with the message "Generate some room designs to see them here."
- **Filtered results empty:** Show "No images found" with the message "Try adjusting your filters to see more results."
- **No selections:** Hide the selection action bar

The provided components include empty state designs - make sure to render them when data is empty rather than showing blank screens.

## Files to Reference

- `product-plan/sections/gallery/README.md` - Feature overview and design intent
- `product-plan/sections/gallery/tests.md` - Test-writing instructions (use for TDD)
- `product-plan/sections/gallery/components/` - React components
- `product-plan/sections/gallery/types.ts` - TypeScript interfaces
- `product-plan/sections/gallery/sample-data.json` - Test data
- `product-plan/sections/gallery/screenshot.png` - Visual reference

## Expected User Flows

### Flow 1: Browse and Filter Sessions

1. User opens Gallery and sees sessions grouped by style and date
2. User applies filters for room type, style, and time period
3. **Outcome:** Session list updates to match selected filters

### Flow 2: Select and Download Images

1. User selects one or more images across sessions
2. User clicks "Download" in the selection bar
3. User enters a folder name and confirms
4. **Outcome:** Download starts with the selected images

### Flow 3: Lightbox Navigation

1. User clicks an image to open the lightbox
2. User navigates with previous/next controls
3. User closes the lightbox
4. **Outcome:** Lightbox closes and the Gallery state remains intact

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All user actions work
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile
