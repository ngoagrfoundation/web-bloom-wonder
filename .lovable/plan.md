

## 9 Fixes: Placeholders, Sanskrit Page, Headings, Layout Width, Initiatives, Hero Styling, Slider Links, Year, Sustainability

---

### 1. Replace phone placeholder `9876543210` with `9999999999`

**Files**: `src/components/forms/VolunteerForm.tsx`, `src/components/forms/ReportChallengeForm.tsx`, `src/components/forms/PartnerForm.tsx`, `src/components/forms/AdoptStudentForm.tsx`

Change `placeholder="9876543210"` to `placeholder="9999999999"` in all 4 files.

---

### 2. Devotional look for Learning Sanskrit page

**File**: `src/pages/programs/LearningSanskrit.tsx`

Add devotional styling using existing branding colors:
- Wrap the Bhagavad Gita section in a warm gradient (`bg-gradient-to-b from-primary/10 to-secondary/10`) with a decorative Om symbol or lotus emoji accent
- Add a saffron/warm-toned decorative border to course detail cards
- Style the "Join the Movement" CTA section with a warm background and subtle border styling
- Add a decorative divider between sections using a traditional pattern (CSS border with primary color)
- Keep all colors within existing palette (primary, secondary, muted)

---

### 3. Remove duplicate "Register as a Volunteer" heading in popups

**Files**: `src/components/ProgramPageLayout.tsx`, `src/components/FocusPageLayout.tsx`

The `DialogTitle` shows "Register as a Volunteer" visibly, but the `VolunteerForm` component already has its own styled header with the same text. Fix by making the `DialogHeader` screen-reader-only (same pattern used in `GetInvolvedSection.tsx`):

```tsx
<DialogHeader className="sr-only">
  <DialogTitle>Register as a Volunteer</DialogTitle>
</DialogHeader>
```

Also remove padding from `DialogContent` (`p-0`) so the form fills edge-to-edge.

---

### 4. Increase "About This Program" section width

**File**: `src/components/ProgramPageLayout.tsx`

Change `max-w-3xl` to `max-w-5xl` on the overview container (line 91) so the text spans wider and looks balanced.

Also check `FocusPageLayout.tsx` for similar narrow content — update its overview section width if needed.

---

### 5. Add new initiative options to Volunteer Form

**File**: `src/components/forms/VolunteerForm.tsx`

Add 3 new items to the `initiatives` array:
- `{ id: "food-distribution", label: "Food Distribution" }`
- `{ id: "other-distribution", label: "Other Items Distribution" }`
- `{ id: "teach-what-you-love", label: "Teach What You Love" }`

---

### 6. Apply inner-page banner text styling to home page slider

**File**: `src/components/HeroSection.tsx`

Currently the home slider uses `bg-black/40` overlay. Inner pages use `bg-gradient-to-r from-primary/90 via-primary/70 to-transparent`. Apply the same gradient overlay to home slider for consistent branding:

Replace `<div className="absolute inset-0 bg-black/40" />` with `<div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />`

---

### 7. Update "Learn More" links per slide

**File**: `src/components/HeroSection.tsx`

Add a `link` field to each slide data object:
- Slide 1 (Volunteers/Motto): `/#about`
- Slide 2 (Education): `/programs/education`
- Slide 3 (Healthcare): `/programs/healthcare`
- Slide 4 (Skill Development): `/focus/skill-development`

Replace the hardcoded `href="#about"` with `slide.link`.

---

### 8. Change year from 2018 to 2025

**Files**:
- `src/components/Footer.tsx` line 81: Change "Making a difference since 2018" to "Making a difference since 2025"
- `src/pages/NewsArticle.tsx` line 28: Change "inception in 2018" to "inception in 2025"

---

### 9. Add Wind Turbine Energy and Bio-gas to Sustainability section

**File**: `src/components/SustainabilitySection.tsx`

Add 2 new entries to the `initiatives` array:
- `{ icon: Wind, title: "Wind Turbine Energy", description: "Harnessing wind power through turbine installations to provide clean, renewable electricity to rural communities." }`
- `{ icon: Flame, title: "Bio-gas Energy", description: "Promoting bio-gas plants that convert organic waste into sustainable cooking fuel and electricity, reducing dependence on fossil fuels." }`

Import `Flame` from lucide-react. Note: the existing "Zero Waste Living" already uses the `Wind` icon — rename that to use `Recycle` or `RefreshCw` to avoid icon duplication, or keep `Wind` for both since they're different concepts.

---

### Files Summary

| File | Changes |
|------|---------|
| `src/components/forms/VolunteerForm.tsx` | Fix placeholder, add 3 initiatives |
| `src/components/forms/ReportChallengeForm.tsx` | Fix placeholder |
| `src/components/forms/PartnerForm.tsx` | Fix placeholder |
| `src/components/forms/AdoptStudentForm.tsx` | Fix placeholder |
| `src/pages/programs/LearningSanskrit.tsx` | Add devotional styling |
| `src/components/ProgramPageLayout.tsx` | Fix dialog heading, widen overview |
| `src/components/FocusPageLayout.tsx` | Fix dialog heading |
| `src/components/HeroSection.tsx` | Apply brand overlay, per-slide links |
| `src/components/Footer.tsx` | 2018 → 2025 |
| `src/pages/NewsArticle.tsx` | 2018 → 2025 |
| `src/components/SustainabilitySection.tsx` | Add Wind Turbine + Bio-gas |

