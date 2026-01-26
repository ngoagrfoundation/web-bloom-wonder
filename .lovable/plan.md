

## Fix Google Sheets Integration + Move Forms to Get Involved Modals

### Problem Summary

1. **Data not saving to Google Sheets**: Network requests show Status: 0 (failed). Root cause is incorrect fetch configuration that triggers CORS preflight requests.

2. **Form sections need to be moved**: The Volunteer, Partner, and Report Challenge form sections should be removed from the landing page and instead open as modals when clicking cards in the "Get Involved" section.

---

### Part 1: Fix Google Sheets Integration

The current fetch configuration in `useGoogleSheetForm.ts` is:

```javascript
fetch(scriptUrl, {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

**The Problems:**
1. `Content-Type: application/json` triggers a CORS preflight `OPTIONS` request
2. Google Apps Script cannot handle `OPTIONS` requests
3. Missing `redirect: "follow"` to handle Google's URL redirect

**The Fix:**
Change to:
```javascript
fetch(scriptUrl, {
  method: "POST",
  redirect: "follow",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify(data),
});
```

**File to modify:** `src/hooks/useGoogleSheetForm.ts`

---

### Part 2: Remove Form Sections from Landing Page

**File to modify:** `src/pages/Index.tsx`

Remove these imports and components:
- `VolunteerFormSection`
- `PartnerFormSection`
- `ReportChallengeSection`

The landing page will go from 14 sections to 11 sections.

---

### Part 3: Update Get Involved Section with Modal Forms

**File to modify:** `src/components/GetInvolvedSection.tsx`

Transform the Get Involved section to:
1. Make cards clickable to open modal dialogs
2. Import the Dialog component from shadcn/ui
3. Import the three form components (VolunteerForm, PartnerForm, ReportChallengeForm)
4. Add state management to track which modal is open
5. Render the appropriate form inside each modal

**Card Behavior:**
| Card | Current Behavior | New Behavior |
|------|-----------------|--------------|
| Volunteer | Scrolls to #volunteer section | Opens Volunteer form modal |
| Partner with Us | Scrolls to #partner section | Opens Partner form modal |
| Adopt a Student | Scrolls to #contact section | Keeps scrolling to contact |
| Report a Challenge | Scrolls to #report-challenge section | Opens Report Challenge form modal |
| Donate | Links to /donate page | Keeps linking to /donate |

---

### Technical Implementation Details

#### File 1: `src/hooks/useGoogleSheetForm.ts`
- Line 64-70: Update fetch configuration
- Remove `mode: "no-cors"`
- Change `Content-Type` to `text/plain;charset=utf-8`
- Add `redirect: "follow"`

#### File 2: `src/pages/Index.tsx`
- Remove imports for VolunteerFormSection, PartnerFormSection, ReportChallengeSection
- Remove corresponding JSX elements from the page

#### File 3: `src/components/GetInvolvedSection.tsx`
- Add useState for modal state: `activeModal: 'volunteer' | 'partner' | 'report' | null`
- Import Dialog, DialogContent, DialogTitle from `@/components/ui/dialog`
- Import VolunteerForm, PartnerForm, ReportChallengeForm
- Import ScrollArea for scrollable modal content
- Update card click handlers to open appropriate modal
- Add three Dialog components with the respective forms

---

### Modal Design

The modals will:
- Use the existing shadcn Dialog component with larger width (`max-w-2xl`)
- Include ScrollArea for forms that exceed viewport height
- Keep the existing form styling (headers, footers, validation)
- Close automatically on successful submission (optional enhancement)

---

### Files Summary

| File | Action | Changes |
|------|--------|---------|
| `src/hooks/useGoogleSheetForm.ts` | Modify | Fix fetch configuration for Google Apps Script |
| `src/pages/Index.tsx` | Modify | Remove 3 form sections |
| `src/components/GetInvolvedSection.tsx` | Modify | Add modal dialogs for 3 forms |

---

### Expected Result

1. Form submissions will successfully save to Google Sheets
2. Landing page will be cleaner with fewer sections
3. Get Involved cards will open modal dialogs with the forms
4. Better user experience - users stay on the page while filling forms
5. Contact form section remains on the landing page (unchanged)

