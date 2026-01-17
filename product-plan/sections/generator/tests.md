# Test Instructions: Generator

These test-writing instructions are framework-agnostic. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Generator screen collects all room generation parameters and starts sequential image creation. Tests should verify selection behavior, summary rendering, progress display, and callback wiring.

---

## User Flow Tests

### Flow 1: Configure and Generate

**Scenario:** User selects all required parameters and starts generation.

#### Success Path

**Setup:**
- Provide full option lists for room types, styles, architects, designers, color wheel, aspect ratio, and quality
- Start with `generationProgress = null`

**Steps:**
1. User selects two room types (e.g., "Living Room" and "Dining Room")
2. User selects a design style (e.g., "Refined Southern Traditional")
3. User selects an architect and designer from the filtered lists
4. User selects "Light" or "Medium" color wheel
5. User selects aspect ratio (e.g., "16:9") and quality (e.g., "High")
6. User clicks the "Generate" button

**Expected Results:**
- [ ] Selection summary shows chips for Rooms, Style, Architect, Designer, Color, Ratio, and Quality
- [ ] "Generate" button becomes enabled only after all selections are made
- [ ] Clicking "Generate" calls `onGenerate`

#### Failure Path: Missing Required Selections

**Setup:**
- Provide data, but leave at least one selection unset

**Steps:**
1. User selects only some parameters
2. User attempts to click "Generate"

**Expected Results:**
- [ ] "Generate" button is disabled
- [ ] `onGenerate` is not called

---

### Flow 2: Style Filtering

**Scenario:** Changing the design style resets the architect/designer selection.

**Setup:**
- Provide two styles with different architect/designer options

**Steps:**
1. User selects a design style
2. User selects an architect and designer
3. User selects a different design style

**Expected Results:**
- [ ] Architect and designer selections are cleared
- [ ] Architect/Designer lists update to match the new style
- [ ] Helper text shows "Select a style above" before a style is chosen

---

### Flow 3: Progress Display

**Scenario:** Generation progress is visible while images are being created.

**Setup:**
- Provide `generationProgress` with `isGenerating: true` and segments for multiple room types

**Steps:**
1. Render the Generator with active progress

**Expected Results:**
- [ ] Progress header shows "Generating: <Room Name>"
- [ ] Completion text shows "X of Y complete"
- [ ] Segment labels show each room type name

---

## Empty State Tests

### No Selections Yet

**Scenario:** User has not selected any parameters.

**Expected Results:**
- [ ] Selection summary shows "Select parameters to begin..."
- [ ] "Generate" button is disabled

### No Filtered Options

**Scenario:** Selected style has no matching architects or designers.

**Setup:**
- Provide a style with zero matching architects/designers

**Expected Results:**
- [ ] Architect section shows "No architects available for this style"
- [ ] Designer section shows "No designers available for this style"

---

## Component Interaction Tests

### SelectionCard

**Renders correctly:**
- [ ] Shows the label text for each option
- [ ] Displays a selection indicator when selected

**User interactions:**
- [ ] Clicking a card calls the correct toggle callback
- [ ] Cards are disabled while `generationProgress.isGenerating` is true

### SelectionSummary

**Renders correctly:**
- [ ] Shows chips for filled selections
- [ ] Shows "Generating..." button state when `isGenerating` is true

---

## Edge Cases

- [ ] Handles multi-select room types and shows them as a comma-separated list
- [ ] Selection summary wraps cleanly with many selected items
- [ ] Switching styles clears architect/designer selection without crashing

---

## Accessibility Checks

- [ ] All buttons are keyboard accessible
- [ ] Disabled buttons use the disabled attribute
- [ ] Focus states are visible on selection cards and the Generate button

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
const mockRoomTypes = [
  { id: 'living-room', name: 'Living Room' },
  { id: 'dining-room', name: 'Dining Room' },
]

const mockDesignStyles = [
  {
    id: 'refined-southern-traditional',
    name: 'Refined Southern Traditional',
    mood: 'Historic, layered, gracious',
    undertone: 'Warm neutral + blue/green heritage hues',
    designerNote: 'Keep saturation low and finishes refined.'
  },
]

const mockArchitects = [
  { id: 'historical-concepts', name: 'Historical Concepts', styleIds: ['refined-southern-traditional'] },
]

const mockDesigners = [
  { id: 'bunny-williams', name: 'Bunny Williams', styleIds: ['refined-southern-traditional'] },
]

const mockProgress = {
  isGenerating: true,
  totalRoomTypes: 2,
  completedRoomTypes: 1,
  currentRoomType: 'Dining Room',
  segments: [
    { roomTypeId: 'living-room', roomTypeName: 'Living Room', status: 'completed' },
    { roomTypeId: 'dining-room', roomTypeName: 'Dining Room', status: 'in-progress' },
  ],
}
```

---

## Notes for Test Implementation

- Mock API calls for generation start/stop as needed
- Verify callbacks fire with the correct IDs
- Test transitions: no selections -> complete selections -> generating state
- Always test empty states by providing empty filtered lists
