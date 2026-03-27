

## 4 Fixes: Slider Text Color, Event Locations, Register Button, Donate Testimonial

### 1. White text and buttons on home page slider

**File**: `src/components/HeroSection.tsx`

- Change subtitle `text-secondary` to `text-white` (line 98)
- Change "Learn More" button from `bg-primary text-primary-foreground` to `bg-white text-primary` with `hover:bg-white/90` (line 106)

### 2. Update all event locations from Mumbai to Hyderabad

**File**: `src/pages/Events.tsx`

Replace all 6 event locations:
- `"AGR Community Center, Sector 12, Mumbai"` → `"AGR Community Center, Kukatpally, Hyderabad"`
- `"Skill Development Center, Andheri East"` → `"Skill Development Center, Kukatpally, Hyderabad"`
- `"Various locations across Mumbai"` → `"Various locations across Hyderabad"`
- `"Grand Ballroom, Taj Hotel, Mumbai"` → `"Grand Ballroom, Taj Hotel, Hyderabad"`
- `"AGR Foundation Office, Bandra"` → `"AGR Foundation Office, Kukatpally, Hyderabad"`
- `"Community Hall, Dadar"` → `"Community Hall, KPHB, Hyderabad"`

### 3. "Register Now" button opens Volunteer popup

**File**: `src/components/EventCard.tsx`

- Accept an `onRegister` callback prop
- Wire the "Register Now" button to call `onRegister()`

**File**: `src/pages/Events.tsx`

- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `ScrollArea`, and `VolunteerForm`
- Add `useState` for showing volunteer modal
- Pass `onRegister={() => setShowVolunteerModal(true)}` to each `<EventCard />`
- Render the volunteer modal dialog at the bottom

### 4. Fix Donate page testimonial

**File**: `src/pages/Donate.tsx`

- Change `"— Rajesh Kumar, Monthly Donor since 2020"` to `"— Rajesh Kumar"`

---

### Files Summary

| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | White subtitle + white button styling |
| `src/pages/Events.tsx` | Mumbai → Hyderabad locations, add volunteer modal |
| `src/components/EventCard.tsx` | Add `onRegister` prop to button |
| `src/pages/Donate.tsx` | Remove "Monthly Donor since 2020" |

