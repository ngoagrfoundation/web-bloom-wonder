

## AGR Foundation — Comprehensive Admin & Landing Page Enhancement

This is a large scope covering admin restructuring, landing page dynamic content, new sections, and global behavior rules. The plan is organized into 4 implementation phases to keep changes manageable.

---

### Phase 1: Admin Structure & Critical Fixes

**A. Admin Sidebar Reorganization (grouped menus)**

Restructure `AdminLayout.tsx` sidebar into grouped sections:

```text
Content Management
  ├── Gallery
  ├── Reels
  ├── News
  └── Events

User Interactions
  ├── Submissions (with sub-items)
  └── Donations

Website Control
  ├── Landing Page Controls (new)
  └── Site Settings
```

- Remove "Database" from sidebar, add it as a button in the top header that opens `/admin/database` in a new tab
- Submissions becomes a parent with 8 sub-routes (contact, volunteer, partner, adopt-student, report-challenge, sanskrit, dental, event-registrations) — each gets its own page with count badges
- Add status toggle (New/Reviewed/Closed) to submissions — requires adding a `status` column to all submission tables

**B. Database opens in new tab**
- `AdminLayout.tsx`: Move Database icon+link to the header, add `target="_blank"`
- `DatabaseBrowser.tsx`: Add standalone auth check so it works without the sidebar wrapper
- Add a new route `/admin/database` that renders DatabaseBrowser inside a minimal layout (no sidebar)

**C. Fix admin scroll (already done but verify)**

**Files:** `AdminLayout.tsx`, `App.tsx` (new routes for submission sub-pages), new `SubmissionDetail.tsx` pages or keep single page with URL-driven type

**SQL:**
```sql
ALTER TABLE contact_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE volunteer_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE partner_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE adopt_student_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE report_challenge_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE sanskrit_registrations ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE dental_registrations ADD COLUMN status VARCHAR(20) DEFAULT 'new';
ALTER TABLE event_registrations ADD COLUMN status VARCHAR(20) DEFAULT 'new';
```

---

### Phase 2: Landing Page — Dynamic Content & Cleanup

**A. Remove ALL static/dummy data**
- `ReelsSection.tsx`: Remove `staticReels` array. If API returns empty, hide entire section.
- `TestimonialsSection.tsx`: Remove `staticTestimonials`. If empty, hide section.
- `NewsSection.tsx`: Remove `staticNews`. If empty, hide section.
- `GallerySection.tsx`: Already database-only — verify it hides when empty.

**B. Global rule: sections with no data = hidden**
- Every dynamic section (`TestimonialsSection`, `ReelsSection`, `NewsSection`, `GallerySection`) returns `null` when data array is empty after API fetch.

**C. Rename Reels section**
- Change title from "Our Reels" to "Impact in Action"
- Add "Show More" link → redirects to `/gallery`

**D. Events scrolling ticker strip**
- New component `EventsTicker.tsx` — horizontal auto-scrolling strip below header
- Fetches upcoming events from `fetchPublicEvents()`
- Hidden if no events exist
- Added to `Index.tsx` between `HeroSection` and `AboutSection`

**E. About Section fixes**
- Reduce text to ~4-5 lines
- Align text height with image
- Fix "Explore Our Work" button to scroll to `#programs` properly

**F. Testimonials → carousel slider**
- Already has prev/next arrows — add auto-rotation timer

**G. News & Stories enhancement**
- Modern card UI (already decent)
- Click → `/news/:slug` detail page (already exists)
- If empty → hide section

**Files:** `ReelsSection.tsx`, `TestimonialsSection.tsx`, `NewsSection.tsx`, `GallerySection.tsx`, `AboutSection.tsx`, new `EventsTicker.tsx`, `Index.tsx`

---

### Phase 3: Landing Page — New Sections & Admin Controls

**A. Partners & Sponsors sections**
- New component `PartnersSection.tsx` — logo grid/slider for "Our Partners"
- New component `SponsorsSection.tsx` — logo grid for "Our Supporters"
- Both fetch from new `partners` and `sponsors` tables
- Admin pages: `PartnersManager.tsx`, `SponsorsManager.tsx` (simple logo upload + name + URL + reorder)
- If no data → hide section

**B. Landing Page Controls panel (new admin page)**
- New page `LandingPageControls.tsx` at `/admin/landing-page`
- Each landing page section gets:
  - Enable/Disable toggle (stored in `site_settings` as `section_hero_enabled`, etc.)
  - Display order control
- Sections: Hero, About, Programs, Sustainability, Causes, Impact Numbers, Testimonials, Reels, Get Involved, News, Gallery, Partners, Sponsors, Contact
- `Index.tsx` fetches settings and conditionally renders sections

**C. Reels: "Number to display on homepage" setting**
- Add `reels_homepage_count` to site_settings
- `ReelsSection.tsx` reads this and slices the array

**D. Gallery: rename "Categories" to "Filters/Tags" throughout**
- Update labels in `GalleryManager.tsx`, `Gallery.tsx`, `GallerySection.tsx`

**SQL:**
```sql
CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo VARCHAR(500),
    website_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo VARCHAR(500),
    website_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New PHP files:** `public/api/admin/partners.php`, `public/api/admin/sponsors.php`, `public/api/public-partners.php`, `public/api/public-sponsors.php`

---

### Phase 4: Polish, Filters & Global Enhancements

**A. Gallery UX upgrade**
- Rename "Categories" to "Folders" (primary) + "Tags" (secondary)
- Add drag-and-drop upload zone
- Image preview modal in admin
- Multi-select already exists — verify it works

**B. Filters across all admin pages**
- Add date range, search, status filters consistently (most already exist)
- Ensure CSV export works everywhere

**C. Replace "Categories" label with "Filters" in Events, News, Gallery**

**D. SEO improvements**
- Add `<title>` and `<meta>` tags to News detail page from article data
- Image alt text already comes from admin

**E. Performance**
- Add `loading="lazy"` to all `<img>` tags (most already have it)
- Images already served from cPanel uploads directory

**F. UX polish**
- Toast notifications already in place
- Add skeleton loaders where missing
- Consistent empty-state illustrations across admin

---

### Summary Table

| Phase | Items | Key Files |
|-------|-------|-----------|
| 1 | Admin restructure, Database in new tab, Submissions sub-pages with status | `AdminLayout.tsx`, `Submissions.tsx`, `DatabaseBrowser.tsx`, `App.tsx` |
| 2 | Remove dummy data, hide-when-empty, events ticker, about fix, reels rename | `ReelsSection.tsx`, `TestimonialsSection.tsx`, `NewsSection.tsx`, `EventsTicker.tsx`, `Index.tsx` |
| 3 | Partners/Sponsors sections, Landing Page Controls panel, reels count setting | New components + admin pages, 4 PHP files, 2 SQL tables |
| 4 | Gallery folders/tags, global filters, SEO, performance, UX polish | Various admin pages, section components |

### Total Scope
- ~12 new files (React + PHP)
- ~20 modified files
- 2 new SQL tables + 8 ALTER statements
- 4 new PHP endpoints

### Recommended Approach
Due to the size, I recommend implementing Phase 1 and Phase 2 first, deploying, testing, then proceeding with Phases 3 and 4. Shall I proceed with Phases 1-2 now?

