# Milestone 2: Generator

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

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
