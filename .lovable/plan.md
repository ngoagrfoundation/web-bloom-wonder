

## Enhanced Admin Dashboard + Dynamic Content on Public Pages

### What This Does

1. **Admin-managed content flows to the public site**: Events, gallery images, and news created in the admin panel will automatically appear on the landing page, Events page, Gallery page, and News page.
2. **News management in admin**: Add a full News/Articles manager (CRUD) to the admin dashboard — currently missing.
3. **Dashboard enhancements**: Better stats, recent activity feed, quick action cards.
4. **Public pages load dynamic content**: Events, Gallery, and News pages fetch from the database first, falling back to static data if the API is unavailable (for preview/offline).

---

### New PHP Endpoint Needed

**`public/api/admin/news.php`** — CRUD for news articles (GET/POST/PUT/DELETE). Also needs a **public read** endpoint: `public/api/news.php` (no auth required, GET only) so the landing page can fetch news without admin session.

Similarly, update `public/api/admin/events.php` and `public/api/admin/gallery.php` to allow **public GET** (unauthenticated reads) — or create separate `public/api/events.php` and `public/api/gallery.php` public endpoints.

**New SQL table** (run in phpMyAdmin):
```sql
CREATE TABLE IF NOT EXISTS news_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    image VARCHAR(500),
    author VARCHAR(100) DEFAULT 'AGR Foundation',
    category VARCHAR(50) DEFAULT 'announcement',
    read_time INT DEFAULT 3,
    is_published TINYINT(1) DEFAULT 1,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### Files to Create

| File | Purpose |
|------|---------|
| `public/api/public-events.php` | Public GET endpoint for events (no auth) |
| `public/api/public-gallery.php` | Public GET endpoint for gallery images (no auth) |
| `public/api/public-news.php` | Public GET endpoint for published news (no auth) |
| `public/api/admin/news.php` | Admin CRUD for news articles |
| `src/pages/admin/NewsManager.tsx` | Admin UI to create, edit, delete news articles |

### Files to Modify

| File | Changes |
|------|---------|
| **`src/lib/api.ts`** | Add `fetchPublicEvents()`, `fetchPublicGallery()`, `fetchPublicNews()` using public (no-auth) endpoints |
| **`src/lib/admin-api.ts`** | Add news CRUD functions: `getNews`, `createNews`, `updateNews`, `deleteNews` |
| **`src/pages/admin/AdminLayout.tsx`** | Add "News" nav item with Newspaper icon |
| **`src/App.tsx`** | Add lazy-loaded `NewsManager` route under `/admin/news` |
| **`src/pages/admin/Dashboard.tsx`** | Enhanced: add gallery count, events count, news count stats; recent activity feed showing last 5 submissions; quick action buttons linking to each admin section |
| **`src/components/GallerySection.tsx`** | Fetch from `fetchPublicGallery()`, fall back to static `featuredImages` |
| **`src/pages/Gallery.tsx`** | Fetch from `fetchPublicGallery()`, merge with or replace static images |
| **`src/pages/Events.tsx`** | Fetch from `fetchPublicEvents()`, fall back to static events array |
| **`src/components/NewsSection.tsx`** | Fetch from `fetchPublicNews()`, fall back to static `latestNews` |
| **`src/pages/News.tsx`** | Fetch from `fetchPublicNews()`, fall back to static `allNews` |
| **`src/pages/NewsArticle.tsx`** | Fetch single article from API by slug, fall back to static data |

---

### Dashboard Enhancements

The current dashboard shows only 3 stat cards and a password form. Enhanced version:

- **6 stat cards**: Submissions, Donations, Amount, Gallery Images, Events, News Articles
- **Recent Activity**: Last 5 form submissions with type badges and timestamps
- **Quick Actions**: Cards with icons linking to "Add Event", "Upload Photo", "Write Article", "View Donations"
- Remove outdated "Google Sheets backup" text

### News Manager Features

- Table listing all articles with title, category, status (published/draft), date
- Create/Edit dialog with: title, slug (auto-generated from title), excerpt, full content (textarea), image URL, author, category, read time, published toggle
- Delete with confirmation
- Preview link that opens the article on the public site

### Dynamic Content Pattern

Each public component follows this pattern:
```
1. On mount, try fetching from PHP API
2. If API returns data, use it (merge with static for fallback images)
3. If API fails (preview mode, offline), use hardcoded static data
4. Show content either way — no blank screens
```

---

### Summary

| Area | Items |
|------|-------|
| New PHP files | 4 (3 public endpoints + 1 admin news CRUD) |
| New React files | 1 (`NewsManager.tsx`) |
| Modified React files | 10 |
| New SQL table | 1 (`news_articles`) |
| Total changes | ~15 files |

