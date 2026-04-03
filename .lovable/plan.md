

## Admin Dashboard Fixes — Database Standalone + Feature Audit

### Problem B: Database Opens Inside Admin Layout

**Root cause**: `/admin/database` is nested inside the `AdminLayout` route in `App.tsx` (line 108), so it renders with the admin sidebar and header.

**Fix**: Move the Database route outside the AdminLayout wrapper so it renders as a standalone full-page layout with its own auth check.

**Files changed**:
- `App.tsx` — Move `/admin/database` route outside the `AdminLayout` parent route
- `DatabaseBrowser.tsx` — Add its own auth check (`useAdminAuth`), remove the negative margins (`-m-4 lg:-m-6`), make it truly full-screen `h-screen` with a minimal header (just "Database Browser" title + close button)

---

### Problem A: Feature Audit — What's Already Implemented vs What Needs Fixing

| Feature | Status | Notes |
|---------|--------|-------|
| Database in top header (not sidebar) | Done | Button in header opens new tab (line 185-194 of AdminLayout) |
| Grouped sidebar menus (Content, User Interactions, Website Control) | Done | Lines 77-109 of AdminLayout |
| Submissions with search, filters, status toggle, CSV, detail modal | Done | In Submissions.tsx |
| Submissions count badge | Done | Line 99 of AdminLayout |
| Donations with filters, stats cards, CSV | Done | In Donations.tsx |
| Gallery folders + tags + multi-select delete | Done | In GalleryManager.tsx |
| Reels toggle visibility + sort order | Done | In ReelsManager.tsx |
| Site Settings with image uploads | Done | In SiteSettings.tsx |
| Landing Page Controls (enable/disable toggles) | Done | In LandingPageControls.tsx |
| Partners + Sponsors managers | Done | Separate admin pages |
| Testimonials manager | Done | In TestimonialsManager.tsx |
| Analytics charts on Dashboard | Done | In Dashboard.tsx |

**Everything in section A is already implemented.** The only real issue is item B — the Database page showing inside the admin layout instead of standalone.

---

### Implementation

1. **`App.tsx`**: Move `/admin/database` route to be a standalone route (outside AdminLayout), same as `/admin` login page
2. **`DatabaseBrowser.tsx`**: Add `useAdminAuth` hook for access control, add a minimal standalone header with "AGR Database Browser" title and a "Back to Admin" link, make layout `h-screen` with no margins

### Technical Details

```
App.tsx routes:
  /admin                → AdminLogin (standalone)
  /admin/database       → DatabaseBrowser (standalone, new tab)  ← MOVE HERE
  AdminLayout wrapper:
    /admin/dashboard    → Dashboard
    /admin/submissions  → Submissions
    ... (all other admin pages stay)
```

DatabaseBrowser gets a slim top bar:
```
┌─────────────────────────────────────────┐
│ 🗄 AGR Database Browser    ← Back to Admin │
├────────────┬────────────────────────────┤
│ Tables     │ Data view                  │
│ (scrolls)  │ (scrolls independently)    │
└────────────┴────────────────────────────┘
```

