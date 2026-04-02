

## Comprehensive Admin Enhancement — 8 Items

### 1. Standalone Database Dashboard with Sidebar Layout

**Current**: Database is a single page inside the admin layout with a dropdown selector.
**Change**: Create a dedicated full-page Database dashboard at `/admin/database` with its own left sidebar listing all tables (grouped by category) and a right content area — both scrolling independently.

**Files to modify:**
- `src/pages/admin/DatabaseBrowser.tsx` — Complete rewrite with a two-panel layout: left sidebar (table list with row counts, grouped into Submissions/Content/System) and right panel (data table with search, pagination, CSV export). Each panel gets `overflow-y-auto` independently.
- `src/pages/admin/AdminLayout.tsx` — Keep Database in nav but route leads to the redesigned page

---

### 2. Admin UI Enhancement — Fix Overlapping Borders + Polish All Pages

Systematic UI cleanup across all admin pages:

**Files to modify (all admin pages):**
- `Dashboard.tsx` — Tighten card spacing, ensure chart cards don't clip, improve mobile responsiveness
- `Submissions.tsx` — Better table cell padding, fix border overlap on filter bar, add subtle row hover colors
- `Donations.tsx` — Fix stat cards overlapping borders, cleaner filter layout
- `GalleryManager.tsx` — Grid card improvements, better image preview sizing
- `EventsManager.tsx` — Cleaner form dialog, better table layout
- `NewsManager.tsx` — Card-based article list instead of plain table
- `ReelsManager.tsx` — Better video card previews
- `TestimonialsManager.tsx` — Quote card layout instead of table rows
- `SiteSettings.tsx` — Better form section spacing
- `AdminLayout.tsx` — Refine sidebar padding, active state contrast

Common fixes: replace `border` with `shadow-sm`, consistent `rounded-xl`, proper `p-0` on Card+Table combos to avoid double borders, uniform filter bar styling with a shared pattern.

---

### 3. Reels Manager — Add Video Upload Option

**Current**: Only has URL input + thumbnail upload. Missing actual video file upload.
**Change**: Add a "Upload Video" tab alongside the URL input — user can either paste a URL OR upload an MP4/WebM file directly.

**Files to modify:**
- `src/pages/admin/ReelsManager.tsx` — Add video file upload with a toggle between "URL" and "Upload" modes. Upload uses the existing `uploadImage` function (which already supports video MIME types via `upload.php`).

---

### 4. Hero Section — Admin Control for Slide Images

**Current**: Hero slides use 6 hardcoded imported images from `src/assets/`.
**Change**: Add a "Hero Slides" management section in Site Settings where admin can view current slide images and upload replacements. Store override image URLs in `site_settings` table (keys: `hero_slide_1` through `hero_slide_6`). HeroSection fetches settings on mount and uses overrides if available, falling back to bundled assets.

**Files to modify:**
- `src/pages/admin/SiteSettings.tsx` — Add "Hero Slides" card showing 6 slide previews with upload/replace buttons
- `src/components/HeroSection.tsx` — On mount, fetch `fetchPublicSettings()` and override slide images if settings exist
- `src/lib/api.ts` — Ensure `fetchPublicSettings()` returns all keys

---

### 5. Landing Page Image Management via Admin

Beyond the hero, other sections with images (About, Programs, Causes, Focus areas) use bundled assets. We'll add an "Image Library" section in Site Settings that lets admin upload replacement images for key sections.

**Files to modify:**
- `src/pages/admin/SiteSettings.tsx` — Add "Section Images" card with upload zones for: About section, Programs (6 programs), Causes (5 causes), Focus areas (5 areas). Each stored as a `site_settings` key like `image_about_main`, `image_program_education`, etc.
- Section components (`AboutSection.tsx`, `ProgramsSection.tsx`, `CausesSection.tsx`) — Fetch settings and use override URLs when available

---

### 6. Gallery Section — Remove Static Images, Use Only DB Content

**Current**: `GallerySection.tsx` initializes with 6 hardcoded static images, then merges API data.
**Change**: Remove all static image imports and default to an empty array. Only show images from the database. If API returns empty, show a "No images yet" placeholder.

**Files to modify:**
- `src/components/GallerySection.tsx` — Remove static imports and `staticImages` array. Initialize `images` as empty. Fetch from API only. Show placeholder if empty.

---

### 7. Impact Numbers — Admin Controlled

**Current**: `ImpactSection.tsx` has hardcoded stats (1500+ Beneficiaries, 30+ Programs, 150+ Volunteers, 8 Districts).
**Change**: Store impact stats in `site_settings` (keys: `impact_stat_1_value`, `impact_stat_1_suffix`, `impact_stat_1_label`, etc. for 4 stats). Admin edits them in Site Settings. ImpactSection fetches on mount, falls back to current hardcoded values.

**Files to modify:**
- `src/pages/admin/SiteSettings.tsx` — Add "Impact Numbers" card with 4 rows of inputs (value, suffix, label)
- `src/components/ImpactSection.tsx` — Fetch settings on mount, override stats if available
- `public/api/public-settings.php` — Already returns all settings, no change needed

---

### 8. Overall Admin UI Design Enhancement

Beyond the border fixes in point 2, apply a cohesive design system:

- **Consistent page headers**: Each page gets a header with title, description, and action buttons in a flex row
- **Filter bars**: Unified pattern — white card with subtle shadow, inputs in a flex-wrap row with consistent height (h-9)
- **Tables**: Consistent cell padding, alternating row colors, sticky headers
- **Cards**: Uniform `rounded-xl shadow-sm` with `hover:shadow-md transition-shadow`
- **Empty states**: Consistent illustration-style empty states instead of plain text
- **Loading states**: Skeleton loaders instead of spinners for tables

**Files to modify**: All admin page components listed in point 2.

---

### Summary

| # | Change | Key Files |
|---|--------|-----------|
| 1 | Database standalone dashboard | `DatabaseBrowser.tsx` |
| 2 | Fix overlapping borders + UI polish | All admin pages |
| 3 | Video upload for Reels | `ReelsManager.tsx` |
| 4 | Hero slide image control | `SiteSettings.tsx`, `HeroSection.tsx` |
| 5 | All landing page images editable | `SiteSettings.tsx`, section components |
| 6 | Remove static gallery images | `GallerySection.tsx` |
| 7 | Impact numbers admin control | `SiteSettings.tsx`, `ImpactSection.tsx` |
| 8 | Cohesive admin UI design system | All admin pages |

### SQL to Run (after deployment)
```sql
-- Impact stats defaults
INSERT INTO site_settings (setting_key, setting_value) VALUES
('impact_stat_1_value', '1500'), ('impact_stat_1_suffix', '+'), ('impact_stat_1_label', 'Beneficiaries Reached'),
('impact_stat_2_value', '30'), ('impact_stat_2_suffix', '+'), ('impact_stat_2_label', 'Programs Running'),
('impact_stat_3_value', '150'), ('impact_stat_3_suffix', '+'), ('impact_stat_3_label', 'Volunteers Active'),
('impact_stat_4_value', '8'), ('impact_stat_4_suffix', ''), ('impact_stat_4_label', 'Districts Covered')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
```

