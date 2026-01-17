# Design Room Generator - Complete Implementation Instructions

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

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are framework-agnostic - adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

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

---

# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind usage guidance
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

### 3. Routing Structure

Create placeholder routes for each section:

- `/generator` (or `/`) - Generator
- `/gallery` - Gallery

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` - Main layout wrapper
- `MainNav.tsx` - Navigation component

**Wire Up Navigation:**

Connect navigation to your routing:

- Generator
- Gallery

**User Menu:**

No user menu is required for this product.

## Files to Reference

- `product-plan/design-system/` - Design tokens
- `product-plan/data-model/` - Type definitions
- `product-plan/shell/README.md` - Shell design intent
- `product-plan/shell/components/` - Shell React components
- `product-plan/shell/screenshot.png` - Shell visual reference (if provided)

## Done When

- [ ] Design tokens are configured
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] Responsive on mobile

---

# Milestone 2: Generator

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the Generator feature - the main interface for configuring and launching room scene generation.

## Overview

The Generator screen lets users select parameters (room types, style, architect, designer, color wheel, aspect ratio, and quality), review a selection summary, and kick off sequential image generation with a segmented progress bar that tracks each room type.

**Key Functionality:**
- Select one or more room types
- Select a design style to filter architects and designers
- Choose architect, designer, color wheel, aspect ratio, and image quality
- Review selections in a persistent summary and enable the Generate button
- Show a segmented progress bar while images generate sequentially
- Navigate to Gallery when generation completes

## Recommended Approach: Test-Driven Development

Before implementing this section, write tests first based on the test specifications provided.

See `product-plan/sections/generator/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic - adapt them to your testing setup.

## What to Implement

### Components

Copy the section components from `product-plan/sections/generator/components/`:

- `Generator`
- `SelectionSummary`
- `SelectionCard`
- `ParameterSection`
- `ProgressBar`

### Data Layer

The components expect these data shapes:

- DesignStyle
- Architect
- Designer
- RoomType
- ColorWheelOption
- AspectRatio
- ImageQualityOption
- GenerationProgress

You will need to:
- Create API endpoints or data fetching logic
- Connect real data to the components

### Callbacks

Wire up these user actions:

- `onRoomTypeToggle(roomTypeId)` - toggle room types in the selection
- `onDesignStyleSelect(styleId)` - set the active design style
- `onArchitectSelect(architectId)` - set the active architect
- `onDesignerSelect(designerId)` - set the active designer
- `onColorWheelSelect(colorId)` - set the active color wheel option
- `onAspectRatioSelect(ratioId)` - set the active aspect ratio
- `onImageQualitySelect(qualityId)` - set the active image quality
- `onGenerate()` - start generation

### Empty States

Implement empty state UI for when data or selections are missing:

- **No selections yet:** Selection summary shows "Select parameters to begin..." and Generate stays disabled
- **No filtered architects/designers:** Show the helper text "No architects available for this style" or "No designers available for this style"
- **Missing style:** Architect/Designer sections show "Select a style above" and appear disabled

The provided components include empty state designs - make sure to render them when data is empty rather than showing blank screens.

## Files to Reference

- `product-plan/sections/generator/README.md` - Feature overview and design intent
- `product-plan/sections/generator/tests.md` - Test-writing instructions (use for TDD)
- `product-plan/sections/generator/components/` - React components
- `product-plan/sections/generator/types.ts` - TypeScript interfaces
- `product-plan/sections/generator/sample-data.json` - Test data
- `product-plan/sections/generator/screenshot.png` - Visual reference

## Expected User Flows

### Flow 1: Configure and Generate

1. User selects one or more room types
2. User selects a design style, architect, and designer
3. User selects color wheel, aspect ratio, and image quality
4. User confirms the summary and clicks "Generate"
5. **Outcome:** Generation starts and the progress bar shows the current room

### Flow 2: Style Filter Updates Options

1. User selects a design style
2. User changes to another design style
3. **Outcome:** Architect and designer selections reset and the filtered lists update

### Flow 3: Sequential Progress

1. User starts generation with multiple room types
2. Progress bar shows segments in pending, in-progress, and completed states
3. **Outcome:** After the final room type completes, the app navigates to Gallery

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All user actions work
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design
- [ ] Responsive on mobile

---

# Milestone 3: Gallery

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete and Milestone 2 (Generator) complete

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
