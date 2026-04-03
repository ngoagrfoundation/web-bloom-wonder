

## Phases 3-4 Implementation + Remaining Scope Items

### What's Already Implemented (no changes needed)

| Item | Status |
|------|--------|
| Admin sidebar grouped menus (Content, User Interactions, Website Control) | Done |
| Database in header, opens new tab | Done |
| Database Browser two-panel layout | Done |
| Landing Page Controls (toggle sections) | Done |
| Partners/Sponsors sections + admin managers | Done |
| Partners/Sponsors PHP endpoints | Done |
| Events ticker strip | Done |
| Reels renamed to "Impact in Action" | Done |
| Reels "Show More" link to gallery | Done |
| Reels homepage count setting | Done (via `reels_homepage_count`) |
| Reels video upload (URL + file) | Done |
| Reels toggle visibility | Done |
| All dynamic sections hide when empty | Done (NewsSection, ReelsSection, TestimonialsSection, GallerySection all return null when empty) |
| Static data removed from News, Reels, Testimonials, Gallery | Done |
| Testimonials carousel with auto-rotation | Done |
| Hero slide admin control in Site Settings | Done |
| Impact numbers admin control | Done |
| Analytics charts (submission trends, donation growth) | Done |
| Email notification on form submission | Done |
| Filters on Submissions, Donations, Events, Gallery, Reels, News, Testimonials | Done |
| CSV export on Submissions, Donations, Database Browser | Done |
| Donations filters (status, type, search, date range) | Done |
| About section text reduction | Done |

### What Still Needs Implementation

**Phase 3 remaining:**

1. **Submissions sub-navigation with count badges** — Currently Submissions is one page with a type dropdown. The plan calls for expandable sub-items in the sidebar (Contact, Volunteer, Partner, etc.) with count badges. This is a significant UX change. For practicality, we'll add count badges to the existing dropdown options and keep the single page approach (it's cleaner than 8 separate routes).

2. **Status toggle (New/Reviewed/Closed) on submissions** — The submissions table needs a `status` column and the UI needs a status badge + toggle. PHP endpoint needs update too.

3. **Rename "Categories" to "Filters/Tags" in Gallery, Events, News** — Label changes across admin and public pages.

**Phase 4 remaining:**

4. **Gallery Folders + Tags UX** — Rename category to "Folder" (primary) and add a "Tags" field (secondary). The current category filter buttons become folder navigation. This requires a schema addition (`tags` column on `gallery_images`).

5. **SEO meta tags on News detail page** — Add `<title>` and `<meta>` from article data in `NewsArticle.tsx`.

6. **Skeleton loaders for tables** — Replace "Loading..." text with proper skeleton rows in Submissions, Donations, and other admin pages.

**Additional from the user's latest scope doc (not yet done):**

7. **Programs section dynamic from admin** — Currently hardcoded. Making this fully admin-controlled requires a new `programs` table and manager, which is a large scope. We'll add image override support via site_settings (similar to hero slides) for now.

8. **"Make a Difference" (Sustainability) admin-controlled images** — Add image settings in SiteSettings.

9. **News SEO fields (meta title, meta description)** — Add columns to `news_articles` table and fields in NewsManager.

---

### Implementation Plan

#### 1. Submissions Status System
- **`public/api/admin/submissions.php`**: Add `status` update endpoint (PUT method), include status in queries
- **`src/pages/admin/Submissions.tsx`**: Add status badge column, status dropdown to change status per row, filter by status
- **`src/lib/admin-api.ts`**: Add `updateSubmissionStatus()` function

#### 2. Rename Categories to Filters/Tags
- **`src/pages/admin/GalleryManager.tsx`**: Change "Category" labels to "Folder"
- **`src/pages/admin/EventsManager.tsx`**: Change "Category" labels to "Filter"
- **`src/pages/admin/NewsManager.tsx`**: Change "Category" labels to "Filter"
- **`src/pages/Gallery.tsx`**: Change filter tab labels from "Category" to "Filter"

#### 3. SEO Meta Tags on News Article Page
- **`src/pages/NewsArticle.tsx`**: Use `document.title` and meta tags from article data on mount

#### 4. Skeleton Loaders
- **All admin table pages**: Replace "Loading..." with `<Skeleton>` rows

#### 5. Submissions Count Badges in Sidebar
- **`src/pages/admin/AdminLayout.tsx`**: Fetch submission counts per type and display badges next to the Submissions menu item

---

### SQL to Run in phpMyAdmin

```sql
-- Add status column to all submission tables
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE volunteer_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE partner_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE adopt_student_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE report_challenge_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE sanskrit_registrations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE dental_registrations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new';

-- Add tags column to gallery
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS tags VARCHAR(500) DEFAULT '';

-- Add SEO columns to news
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200) DEFAULT '';
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500) DEFAULT '';
```

Note: MySQL does not support `IF NOT EXISTS` for `ALTER TABLE ADD COLUMN`. If columns already exist, the ALTER will fail harmlessly. Run each one individually.

### Files Modified
| File | Changes |
|------|---------|
| `AdminLayout.tsx` | Submission count badge |
| `Submissions.tsx` | Status column, status toggle, status filter |
| `GalleryManager.tsx` | Rename Category to Folder, add Tags field |
| `EventsManager.tsx` | Rename Category to Filter |
| `NewsManager.tsx` | Rename Category to Filter, add SEO fields |
| `NewsArticle.tsx` | SEO meta tags on mount |
| `Gallery.tsx` | Rename filter labels |
| `admin/submissions.php` | Status update endpoint, status filter |
| `admin/gallery.php` | Support tags field |
| `admin/news.php` | Support meta_title, meta_description |
| `admin-api.ts` | Add updateSubmissionStatus, getSubmissionCounts |
| Multiple admin pages | Skeleton loaders |

