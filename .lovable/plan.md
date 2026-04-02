

## Full Admin Dashboard + Database Integration

### Architecture Decision

**Same project, `/admin` route** — best for cPanel because:
- Single deployment (one `dist` folder upload)
- Shared components and styling
- The admin subdomain (`admin.agrfoundation.ngo`) can point to the same hosting with a redirect to `/admin`

**PHP session login** — best for cPanel/MySQL because:
- No external auth service needed
- Admin credentials stored in the database (hashed)
- PHP sessions handle authentication state

---

### Overview

```text
React Frontend ──fetch()──► PHP API (public/api/) ──PDO──► MySQL
                                  │
                        ┌─────────┴──────────┐
                        │                    │
                   Form/Donation         Admin CRUD
                   submissions         (gallery, events,
                                        submissions view)
```

---

### Phase 1: PHP API Backend (in `public/api/`)

These PHP files get copied as-is to `dist/api/` during build. They only work on cPanel, not in Lovable preview.

| File | Purpose |
|------|---------|
| `public/api/config.php` | DB credentials + PDO connection + CORS headers |
| `public/api/setup.php` | One-time table creation script (delete after use) |
| `public/api/auth.php` | Admin login/logout/session check |
| `public/api/submit-form.php` | Insert form submissions |
| `public/api/record-donation.php` | Insert donation records |
| `public/api/admin/submissions.php` | GET all form submissions (auth required) |
| `public/api/admin/donations.php` | GET all donation records (auth required) |
| `public/api/admin/gallery.php` | CRUD gallery images + file upload (auth required) |
| `public/api/admin/events.php` | CRUD events (auth required) |

**Database tables:**
- `admin_users` — id, username, password_hash
- `form_submissions` — id, form_type, data (JSON), ip_address, submitted_at
- `donations` — id, razorpay_payment_id, donor_name, donor_email, donor_phone, amount, donation_type, pan_number, status, created_at
- `gallery_images` — id, src, alt, category, caption, created_at
- `events` — id, title, description, date, time, location, category, image, attendees, is_featured, created_at

**Security:** PDO prepared statements, password_hash/verify, session-based auth, CORS restricted to your domain.

---

### Phase 2: Frontend Form Integration

| File | Change |
|------|--------|
| `src/lib/api.ts` | New file — API base URL config + fetch helpers |
| `src/hooks/useGoogleSheetForm.ts` | After Google Sheets POST succeeds, also POST to PHP API (fire-and-forget, so Google Sheets still works even if DB is down) |
| `src/components/DonationForm.tsx` | After Razorpay success handler, POST payment details to `record-donation.php` |
| `src/components/HeroSection.tsx` | Sanskrit/Dental registration forms also POST to PHP API |

---

### Phase 3: Admin Dashboard UI

**New files:**

| File | Purpose |
|------|---------|
| `src/pages/admin/AdminLogin.tsx` | Login page with username/password |
| `src/pages/admin/AdminLayout.tsx` | Sidebar layout with nav links |
| `src/pages/admin/Dashboard.tsx` | Overview with counts/stats |
| `src/pages/admin/Submissions.tsx` | Table of all form submissions with filters |
| `src/pages/admin/Donations.tsx` | Table of donation records with totals |
| `src/pages/admin/GalleryManager.tsx` | Upload/edit/delete gallery images |
| `src/pages/admin/EventsManager.tsx` | Create/edit/delete events |
| `src/hooks/useAdminAuth.ts` | Auth state hook (checks PHP session) |
| `src/lib/admin-api.ts` | Admin API fetch helpers with auth |

**Routes added to App.tsx:**
- `/admin` → login or redirect to dashboard
- `/admin/dashboard` → stats overview
- `/admin/submissions` → form submissions table
- `/admin/donations` → donation records table
- `/admin/gallery` → gallery image manager
- `/admin/events` → events manager

**Admin UI features:**
- Sidebar navigation with all sections
- Data tables with search, filter by form type/date
- Gallery: drag-and-drop image upload, edit captions, delete
- Events: form to create/edit events with all fields
- Export submissions/donations as CSV
- Responsive design using existing Tailwind/shadcn components

---

### Phase 4: Dynamic Content (Gallery + Events pages read from DB)

Once admin can manage gallery and events, the public pages should read from the database:

| File | Change |
|------|--------|
| `src/pages/Gallery.tsx` | Fetch images from API, fall back to static data if API unavailable |
| `src/pages/Events.tsx` | Fetch events from API, fall back to static data if API unavailable |

This graceful fallback ensures the site works both in Lovable preview (static data) and on cPanel (dynamic from DB).

---

### Setup Instructions (after deploying to cPanel)

1. Create MySQL database in cPanel → MySQL Databases
2. Create a database user and assign it to the database with ALL PRIVILEGES
3. Edit `api/config.php` with your DB name, username, password
4. Visit `yourdomain.com/api/setup.php` in browser — creates all tables + default admin user
5. Delete `setup.php` from server
6. Login at `yourdomain.com/admin` with default credentials
7. Change admin password from the dashboard

**For subdomain:** In cPanel, point `admin.agrfoundation.ngo` to the same document root and add a redirect rule to `/admin`.

---

### Files Summary

| Category | Files | Count |
|----------|-------|-------|
| PHP API | `public/api/*.php` + `public/api/admin/*.php` | ~9 |
| Frontend hooks/utils | `src/lib/api.ts`, `src/lib/admin-api.ts`, `src/hooks/useAdminAuth.ts` | 3 |
| Admin pages | `src/pages/admin/*.tsx` | 7 |
| Modified existing | `useGoogleSheetForm.ts`, `DonationForm.tsx`, `HeroSection.tsx`, `Gallery.tsx`, `Events.tsx`, `App.tsx` | 6 |
| **Total** | | **~25 files** |

---

### Important Notes

- PHP files won't execute in Lovable preview — they only work on cPanel. The admin panel UI will render but API calls will fail in preview.
- The public site (Gallery, Events) uses a fallback pattern: try API first, use static data if unavailable.
- All admin endpoints require a valid PHP session — no public access to admin data.
- Image uploads go to a `uploads/gallery/` folder on cPanel.

