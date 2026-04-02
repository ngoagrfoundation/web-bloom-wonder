

## Admin Dashboard Comprehensive Enhancement — 7 Items

### 1. Seed Existing Static Content into Admin (Gallery + News)

The landing page has hardcoded gallery images and news articles that don't appear in the admin. We'll add a "Seed Static Content" button on the Dashboard that inserts all existing static images (from `GallerySection.tsx` static data) and news articles (from `NewsSection.tsx` static data) into the database via the admin API. This is a one-time action.

**Files to modify:**
- `src/pages/admin/Dashboard.tsx` — Add a "Seed Static Content" card with buttons to import static gallery images and news into the DB
- `src/lib/admin-api.ts` — Add `seedStaticContent()` function that POSTs existing static data to create gallery/news entries

**Note:** Hero section images (program slides) are bundled assets tied to specific page layouts. Making every section image admin-editable would require a full CMS architecture. Instead, the Site Settings page will get image upload fields for key branding assets (logo, hero background). Other section images remain as bundled assets that can be replaced by uploading new files to cPanel.

**Files to modify for Site Settings image uploads:**
- `src/pages/admin/SiteSettings.tsx` — Add image upload fields for hero background, logo, and OG image
- `public/api/admin/settings.php` — Support file uploads for settings images

---

### 2. Analytics Charts on Dashboard

Add two charts: submission trends (last 30 days) and donation growth (last 12 months).

**New PHP endpoint:** `public/api/admin/analytics.php`
- `?type=submissions` — Returns daily submission counts for last 30 days
- `?type=donations` — Returns monthly donation totals for last 12 months

**Files to modify:**
- `src/pages/admin/Dashboard.tsx` — Add two Recharts area/bar charts below the stats grid
- `src/lib/admin-api.ts` — Add `getSubmissionTrends()` and `getDonationTrends()` functions

**New file:** `public/api/admin/analytics.php`

---

### 3. Email Notifications for New Submissions

Add PHP `mail()` call in `submit-form.php` to notify admin when a form is submitted. This is the simplest approach for cPanel hosting — no external service needed.

**Files to modify:**
- `public/api/submit-form.php` — After successful insert, call `mail()` to send notification to admin email
- `public/api/admin/settings.php` — Already stores `email` setting; we'll read it for the notification recipient
- `src/pages/admin/SiteSettings.tsx` — Add "Notification Email" field (separate from public contact email)

Add a new `site_settings` key: `notification_email` for the admin notification recipient.

---

### 4. Video/Thumbnail Upload for Reels

Replace manual URL inputs with file upload in ReelsManager.

**Files to modify:**
- `src/pages/admin/ReelsManager.tsx` — Add file upload for thumbnail (reuse `uploadImage` from admin-api), and optionally for video files
- `public/api/admin/upload.php` — Add `reels` to allowed folders; add video MIME types (mp4, webm) to allowed types with higher size limit (50MB)

---

### 5. Fix Admin Layout Scrolling (Sidebar + Main Body Independent Scroll)

Currently the sidebar and main content share the same scroll context. Fix by making the sidebar and main area each independently scrollable with `overflow-y-auto` and `h-screen`.

**File to modify:** `src/pages/admin/AdminLayout.tsx`
- Change outer container to `h-screen overflow-hidden` instead of `min-h-screen`
- Sidebar: already has `overflow-y-auto` on nav, but needs `h-screen` on the aside and `overflow-hidden` on the flex container
- Main content area: wrap in `overflow-y-auto h-screen` (or `flex-1 overflow-y-auto`)
- Header stays `sticky top-0`

---

### 6. Database Browser — Dropdown Navigation + Horizontal Scroll + Better Design

Redesign the Database Browser to use a sidebar/dropdown for table selection instead of button chips, and ensure wide tables scroll horizontally.

**File to modify:** `src/pages/admin/DatabaseBrowser.tsx`
- Replace table selector buttons with a `Select` dropdown grouped by category (Submissions, Content, System)
- Table grouping: Submissions (contact, volunteer, partner, adopt_student, report_challenge, sanskrit, dental, event_registrations), Content (gallery_images, events, news_articles, reels, testimonials), System (admin_users, donations, site_settings)
- Ensure `overflow-x-auto` is applied (already present but verify it works with `min-w-max` on the table)
- Add row count badges in the dropdown options
- Add date range filter input for tables with `submitted_at` or `created_at` columns

**Also update `AdminLayout.tsx`:**
- Replace the single "Database" nav item with a collapsible section showing table sub-links, or keep it as a single link but with the dropdown inside DatabaseBrowser

---

### 7. Proper Filters Across All Admin Pages

Add consistent filtering capabilities to each admin page:

| Page | Filters to Add |
|------|---------------|
| `Submissions.tsx` | Date range picker, search by name/email (already has form type filter) |
| `Donations.tsx` | Date range, status filter (success/failed), donation type filter, search by donor name |
| `GalleryManager.tsx` | Already has category filter — add search by alt text |
| `EventsManager.tsx` | Category filter, date range, featured toggle filter |
| `NewsManager.tsx` | Category filter, published/draft filter, search by title |
| `ReelsManager.tsx` | Published/unpublished filter, search by title |
| `TestimonialsManager.tsx` | Published/unpublished filter |

**Files to modify:** All 7 admin page components listed above.

For date range filtering, add two date `<Input type="date">` fields. For search, add a text input. Filters are applied client-side for small datasets (events, gallery, news, reels, testimonials) and server-side for paginated datasets (submissions, donations).

For server-side filters, update:
- `public/api/admin/submissions.php` — Add `search` and `date_from`/`date_to` query params
- `public/api/admin/donations.php` — Add `status`, `type`, `search`, `date_from`/`date_to` params

---

### New Files
| File | Purpose |
|------|---------|
| `public/api/admin/analytics.php` | Submission trends + donation growth data |

### Modified Files (Summary)
| File | Changes |
|------|---------|
| `src/pages/admin/Dashboard.tsx` | Analytics charts, seed static content button |
| `src/pages/admin/AdminLayout.tsx` | Fix independent scrolling |
| `src/pages/admin/DatabaseBrowser.tsx` | Dropdown nav, grouped tables, better design |
| `src/pages/admin/ReelsManager.tsx` | File upload for thumbnail/video, filter |
| `src/pages/admin/Submissions.tsx` | Date range + search filters |
| `src/pages/admin/Donations.tsx` | Date, status, type, search filters |
| `src/pages/admin/EventsManager.tsx` | Category + date filters |
| `src/pages/admin/NewsManager.tsx` | Category + status filters |
| `src/pages/admin/TestimonialsManager.tsx` | Published filter |
| `src/pages/admin/GalleryManager.tsx` | Search filter |
| `src/pages/admin/SiteSettings.tsx` | Notification email + image uploads |
| `src/lib/admin-api.ts` | Analytics + seed functions |
| `public/api/submit-form.php` | Email notification on submission |
| `public/api/admin/submissions.php` | Search + date filter params |
| `public/api/admin/donations.php` | Status, type, search, date params |
| `public/api/admin/upload.php` | Video support for reels |

### SQL to Run (after deployment)
```sql
INSERT INTO site_settings (setting_key, setting_value) VALUES
('notification_email', 'info@agrfoundation.ngo')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
```

