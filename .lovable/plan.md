

## Admin Dashboard Enhancement + Reels, Testimonials, and Profile Management

### Overview
Four major additions: (1) Reels section on landing page with admin management, (2) dynamic testimonials with admin CRUD, (3) foundation profile settings in admin, and (4) improved admin dashboard UI design.

---

### New SQL Tables (run in phpMyAdmin)

```sql
CREATE TABLE IF NOT EXISTS reels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    description TEXT,
    is_published TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(200) NOT NULL,
    photo VARCHAR(500),
    is_published TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default profile settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('org_name', 'AGR Foundation'),
('tagline', 'Serving Society, Strengthening Lives'),
('about_text', 'AGR Foundation is a non-profit organization dedicated to social welfare, education, healthcare, and environmental safety.'),
('email', 'info@agrfoundation.ngo'),
('phone', '+91 9876543210'),
('address', 'Hyderabad, Telangana, India'),
('facebook', ''),
('instagram', ''),
('twitter', ''),
('youtube', ''),
('linkedin', '')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
```

---

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ReelsSection.tsx` | Landing page reels carousel (horizontal scroll of short videos with thumbnails) |
| `src/pages/admin/ReelsManager.tsx` | Admin CRUD for reels — upload video URL, thumbnail, title, reorder |
| `src/pages/admin/TestimonialsManager.tsx` | Admin CRUD for testimonials — add/edit/delete quotes, names, roles, photos |
| `src/pages/admin/SiteSettings.tsx` | Profile/settings page — org name, tagline, contact info, social links |
| `public/api/admin/reels.php` | Admin CRUD endpoint for reels table |
| `public/api/admin/testimonials.php` | Admin CRUD endpoint for testimonials table |
| `public/api/admin/settings.php` | Admin CRUD endpoint for site_settings table |
| `public/api/public-reels.php` | Public GET endpoint for published reels |
| `public/api/public-testimonials.php` | Public GET endpoint for published testimonials |
| `public/api/public-settings.php` | Public GET endpoint for site settings (no auth) |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add `ReelsSection` above `GallerySection` |
| `src/components/TestimonialsSection.tsx` | Fetch testimonials from API, fall back to static data |
| `src/pages/admin/AdminLayout.tsx` | Add nav items: Reels, Testimonials, Site Settings |
| `src/pages/admin/Dashboard.tsx` | Complete UI redesign with gradient header, better stat cards with trend indicators, chart-style recent activity, welcome banner, and links to all new sections |
| `src/App.tsx` | Add lazy routes for `/admin/reels`, `/admin/testimonials`, `/admin/settings` |
| `src/lib/api.ts` | Add `fetchPublicReels()`, `fetchPublicTestimonials()`, `fetchPublicSettings()` |
| `src/lib/admin-api.ts` | Add CRUD functions for reels, testimonials, and settings; update dashboard stats to include reels/testimonials counts |
| `src/components/Footer.tsx` | Optionally fetch social links from settings API |

---

### 1. Reels Section (Landing Page)

- Horizontal scrollable row of video cards (Instagram Reels / YouTube Shorts style)
- Each card shows a thumbnail with a play button overlay, title below
- Clicking opens the video in a dialog/modal (embedded iframe or HTML5 video)
- Placed between Testimonials and Gallery on the landing page
- Admin can add reels via URL (YouTube, Instagram embed links) with a thumbnail upload

### 2. Testimonials — Dynamic from Admin

- `TestimonialsSection.tsx` fetches from `public-testimonials.php` on mount
- Falls back to the 4 existing hardcoded testimonials if API is unavailable
- Admin manager: table view with add/edit/delete, optional photo upload, drag-to-reorder via sort_order
- Each testimonial has: quote, name, role, photo (optional), published toggle

### 3. Site Settings / Profile Control

- Admin page with editable fields for: Organization Name, Tagline, About Text, Email, Phone, Address, and Social Media links (Facebook, Instagram, Twitter, YouTube, LinkedIn)
- These values are fetched by the footer and about section to display dynamic contact info
- Simple key-value store in `site_settings` table — no complex schema needed

### 4. Dashboard UI Redesign

- **Welcome banner** with gradient background, date, and admin name
- **Stat cards** redesigned with subtle gradients, hover animations, and icon backgrounds
- **Recent activity** shown as a timeline with colored dots per form type
- **Quick actions** as icon-prominent cards in a 2x3 grid instead of plain buttons
- **New stat cards** for Reels count and Testimonials count (total 8 stats)
- Overall: more whitespace, rounded corners, softer shadows — matching the site's minimalist design

---

### Summary

| Area | Count |
|------|-------|
| New PHP files | 6 (3 admin + 3 public endpoints) |
| New React pages | 3 (ReelsManager, TestimonialsManager, SiteSettings) |
| New React component | 1 (ReelsSection) |
| Modified files | 8 |
| New SQL tables | 3 (reels, testimonials, site_settings) |

### After Deployment
1. Run the SQL in phpMyAdmin to create 3 new tables
2. Upload updated PHP files to cPanel
3. Deploy React build
4. Test: add a reel in admin, check it appears on the landing page
5. Test: edit a testimonial in admin, check it updates on the landing page
6. Test: update org info in Site Settings, check footer reflects the changes

