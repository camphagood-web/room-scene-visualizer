# Test Instructions: Gallery

These test-writing instructions are framework-agnostic. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Gallery screen groups generated images by session, supports filtering, selection, downloads, and fullscreen viewing. Tests should cover filters, selection logic, lightbox navigation, and download flows.

---

## User Flow Tests

### Flow 1: Browse and Filter Sessions

**Scenario:** User filters sessions by time period, room type, and style.

#### Success Path

**Setup:**
- Provide multiple sessions with different dates and room types
- Start with `activeFilters` set to `all-time` and empty selections

**Steps:**
1. User opens Gallery and sees the header "Gallery"
2. User clicks a time period filter (e.g., "This Week")
3. User clicks a room type filter (e.g., "Kitchen")
4. User clicks a design style filter (e.g., "Modern Mountain Retreat")

**Expected Results:**
- [ ] Filters panel shows labels "Time Period", "Room Type", and "Design Style"
- [ ] Filter buttons update their selected styles
- [ ] Session list updates to match the filters

#### Failure Path: Filters Return No Results

**Setup:**
- Apply filters that match no sessions

**Expected Results:**
- [ ] Empty state heading shows "No images found"
- [ ] Message shows "Try adjusting your filters to see more results."

---

### Flow 2: Select and Download Images

**Scenario:** User selects images and downloads them as a zip.

#### Success Path

**Setup:**
- Provide at least two sessions with images

**Steps:**
1. User selects multiple images across sessions
2. Selection bar appears showing "X selected"
3. User clicks "Download" in the selection bar
4. Download modal opens with title "Download Images"
5. User enters a folder name and confirms

**Expected Results:**
- [ ] Selection bar shows "Clear" and "Download" actions
- [ ] Download modal shows label "Folder name" and placeholder "Enter folder name..."
- [ ] Clicking "Download" calls `onDownloadConfirm` with the filename

#### Failure Path: Empty Filename

**Setup:**
- Open the download modal with an empty file name

**Expected Results:**
- [ ] Download button is disabled until a name is provided

---

### Flow 3: Lightbox Navigation

**Scenario:** User opens an image in fullscreen and navigates between images.

**Steps:**
1. User clicks an image (or the "View" overlay) to open the lightbox
2. User clicks "Next image" and "Previous image"
3. User presses Escape to close

**Expected Results:**
- [ ] Lightbox opens with the selected image and metadata
- [ ] Prev/Next buttons call `onLightboxPrev` and `onLightboxNext`
- [ ] Escape closes the lightbox via `onLightboxClose`

---

### Flow 4: Regenerate From Session

**Scenario:** User triggers regeneration from a session or lightbox.

**Steps:**
1. User clicks "Regenerate" on a session header
2. User opens the lightbox and clicks "Regenerate"

**Expected Results:**
- [ ] `onRegenerate` is called with the session id

---

## Empty State Tests

### No Sessions Yet

**Setup:**
- Provide `sessions = []`

**Expected Results:**
- [ ] Empty state heading shows "No images found"
- [ ] Message shows "Generate some room designs to see them here."

### Filtered Empty State

**Setup:**
- Provide sessions but apply filters that match none

**Expected Results:**
- [ ] Empty state shows "No images found"
- [ ] Message shows "Try adjusting your filters to see more results."

---

## Component Interaction Tests

### SessionGroup

**Renders correctly:**
- [ ] Shows style name, architect, and designer
- [ ] Shows session tags for color wheel, aspect ratio, and image quality

**User interactions:**
- [ ] Select-all checkbox toggles `onSessionSelect`
- [ ] "Download" button triggers `onDownloadSession`
- [ ] "Regenerate" button triggers `onRegenerate`

### ImageCard

**Renders correctly:**
- [ ] Shows room type label beneath the image

**User interactions:**
- [ ] Clicking checkbox toggles `onImageSelect`
- [ ] Clicking the image triggers `onImageView`

### GalleryFilters

**Renders correctly:**
- [ ] Shows "Filters" heading and "Clear all" when filters are active
- [ ] Date range buttons include "Today", "This Week", "This Month", "All Time"

---

## Edge Cases

- [ ] Session with a single image still shows correct header and actions
- [ ] Select-all reflects partial selection state
- [ ] Selection bar hides when `selectedImages` becomes empty
- [ ] Lightbox handles first and last image navigation states

---

## Accessibility Checks

- [ ] "Select all" buttons have accessible labels ("Select all" / "Deselect all")
- [ ] Lightbox buttons have aria labels ("Close", "Previous image", "Next image")
- [ ] Modal can be closed with Escape

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
const mockSessions = [
  {
    id: 'session-001',
    createdAt: '2026-01-17T14:32:00Z',
    designStyle: { id: 'refined-southern-traditional', name: 'Refined Southern Traditional' },
    architect: { id: 'historical-concepts', name: 'Historical Concepts' },
    designer: { id: 'bunny-williams', name: 'Bunny Williams' },
    colorWheel: 'Medium',
    aspectRatio: '16:9',
    imageQuality: 'High',
    images: [
      { id: 'img-001', roomType: { id: 'living-room', name: 'Living Room' }, url: '/samples/a.jpg', selected: false },
    ],
  },
]

const mockFilters = {
  roomTypes: [
    { id: 'living-room', name: 'Living Room' },
    { id: 'kitchen', name: 'Kitchen' },
  ],
  designStyles: [
    { id: 'refined-southern-traditional', name: 'Refined Southern Traditional' },
  ],
  dateRanges: [
    { id: 'today', name: 'Today' },
    { id: 'this-week', name: 'This Week' },
    { id: 'this-month', name: 'This Month' },
    { id: 'all-time', name: 'All Time' },
  ],
}
```

---

## Notes for Test Implementation

- Mock downloads and regeneration actions to avoid side effects
- Verify filter changes update sessions and image counts
- Always test empty states by passing empty arrays or filter mismatches
