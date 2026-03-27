

## Fix Font, Impact Section, Dental Stats, Related Focus, CTA Buttons

### 6 Changes

---

### 1. Change font family to Poppins

**Files**: `index.html`, `tailwind.config.ts`, `src/index.css`

- Add Google Fonts import for Poppins (weights 300-700) in `index.html`, replacing Playfair Display + Source Sans 3
- Update `tailwind.config.ts` `fontFamily.sans` to `['Poppins', ...]` and `fontFamily.display` to `['Poppins', ...]`
- Update `src/index.css` Google Fonts `@import` URL to Poppins

---

### 2. Fix "Our Impact" section visibility in ProgramPageLayout

**File**: `src/components/ProgramPageLayout.tsx`

The Impact section uses `maroon-gradient` class which is never defined in CSS. Replace with `bg-primary text-primary-foreground` (same pattern used in `FocusPageLayout.tsx` line 132).

---

### 3. Fix Dental Treatment page duplicate stats

**File**: `src/pages/programs/DentalTreatment.tsx`

The `stats` array contains `{ value: "28th", label: "Every Month" }` and `{ value: "10AM–5PM", label: "Clinic Hours" }` which duplicates the "When & Where" section below. Replace those stats with meaningful impact numbers:
- `500+` Patients Treated
- `100%` Free Treatment
- `12+` Monthly Camps
- `6` Services Offered

---

### 4. Remove Related Focus Areas from recently added pages

**Files**: `src/pages/programs/DentalTreatment.tsx`, `src/pages/programs/LearningSanskrit.tsx`, `src/pages/programs/FoodDistribution.tsx`

Remove the `relatedFocus` prop from all three pages. The `ProgramPageLayout` already conditionally renders this section only when `relatedFocus.length > 0`, so passing an empty array (or omitting it) will hide it.

---

### 5. "Get Involved" button opens Volunteer Registration popup

**Files**: `src/components/ProgramPageLayout.tsx`, `src/components/FocusPageLayout.tsx`

Currently "Get Involved" links to `/#contact`. Change it to open a `VolunteerForm` modal dialog inline:
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `ScrollArea` and `VolunteerForm`
- Add state `const [showVolunteerModal, setShowVolunteerModal] = useState(false)`
- Replace the `<Link>` / `<a>` with a `<button>` that sets `showVolunteerModal(true)`
- Add a `<Dialog>` with `<VolunteerForm onSuccess={() => setShowVolunteerModal(false)} />` at the end of the section

---

### 6. "Donate Now" button scrolls to inline donation section on same page

**Files**: `src/components/ProgramPageLayout.tsx`, `src/components/FocusPageLayout.tsx`

Instead of linking to `/donate`, embed a `DonationForm` component within each layout that is hidden by default and revealed when clicking "Donate Now":
- Add state `const [showDonation, setShowDonation] = useState(false)`
- Add a `<section id="donate-section">` with `<DonationForm />` that renders conditionally (or always renders and scrolls into view)
- Replace `<Link to="/donate">` with a button that sets `showDonation(true)` and scrolls to `#donate-section` using `scrollIntoView`
- Import `DonationForm` component

---

### Files Summary

| File | Change |
|------|--------|
| `index.html` | Add Poppins font link |
| `src/index.css` | Update Google Fonts import to Poppins |
| `tailwind.config.ts` | Update font families to Poppins |
| `src/components/ProgramPageLayout.tsx` | Fix impact bg, add volunteer modal + inline donation |
| `src/components/FocusPageLayout.tsx` | Add volunteer modal + inline donation |
| `src/pages/programs/DentalTreatment.tsx` | Fix stats, remove relatedFocus |
| `src/pages/programs/LearningSanskrit.tsx` | Remove relatedFocus |
| `src/pages/programs/FoodDistribution.tsx` | Remove relatedFocus |

