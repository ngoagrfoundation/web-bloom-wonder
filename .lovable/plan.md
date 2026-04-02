

## Admin Dashboard Complete Enhancement

### Overview
Six major improvements: (1) gallery category filtering with custom categories, (2) event registration form, (3) database browser in admin, (4) existing static content seeding info, (5) image upload support for events/news, and (6) overall admin polish.

---

### 1. Gallery Manager — Category Folders + "Others" Custom Category

**File: `src/pages/admin/GalleryManager.tsx`**
- Add category filter tabs at the top to browse images by category (like folders)
- Add "others" to the category list with a custom name input that appears when "others" is selected
- Show image count per category
- Add bulk select/delete
- Add drag-to-reorder (sort_order) support

**File: `public/api/admin/gallery.php`**
- Add `?category=xxx` filter support on GET

---

### 2. Event Registration Form (replaces Volunteer modal)

**New file: `src/components/forms/EventRegistrationForm.tsx`**
- Fields: Full Name, Email, Phone, Number of Participants, Event Category (pre-filled from event), Special Requirements (textarea)
- Pre-fills event title and category from the clicked event
- Generic enough for all event types, with "Others" option for category

**New SQL table** (run in phpMyAdmin):
```sql
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(255) NOT NULL,
    event_category VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    participants INT DEFAULT 1,
    special_requirements TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**File: `src/pages/Events.tsx`**
- Replace `VolunteerForm` modal with `EventRegistrationForm`, passing the selected event's title and category

**File: `public/api/submit-form.php`**
- Add `event_registration` case to route to the new table

**File: `src/pages/admin/Submissions.tsx`**
- Add `event_registration` to `formTypes` list and `summaryColumns`

**File: `public/api/admin/submissions.php`**
- Add `event_registration` → `event_registrations` table mapping

---

### 3. Database Browser in Admin

**New file: `src/pages/admin/DatabaseBrowser.tsx`**
- A tabbed view showing all database tables: contact_submissions, volunteer_submissions, partner_submissions, adopt_student_submissions, report_challenge_submissions, sanskrit_registrations, dental_registrations, event_registrations, donations, gallery_images, events, news_articles, admin_users
- Each tab shows the table data in a paginated table with search/filter
- Row count per table shown as badges on tabs
- Export CSV per table
- This consolidates everything into one view so you don't need phpMyAdmin

**New PHP file: `public/api/admin/database.php`**
- Admin-only endpoint that accepts `?table=xxx&page=1&limit=50&search=xxx`
- Returns paginated data from any allowed table (whitelist of table names for security)
- Also returns table list with row counts at `?action=tables`

**File: `src/lib/admin-api.ts`**
- Add `getTableList()` and `getTableData(table, page, limit, search)` functions

**File: `src/pages/admin/AdminLayout.tsx`**
- Add "Database" nav item with Database icon

**File: `src/App.tsx`**
- Add lazy route for `/admin/database`

---

### 4. Image Upload for Events and News (replace URL-only input)

**File: `src/pages/admin/EventsManager.tsx`**
- Replace the "Image URL" text input with a file upload zone (like GalleryManager)
- Upload goes to `/uploads/events/` via a new PHP handler, or reuse gallery upload endpoint with a different folder
- Show image preview in the form

**File: `src/pages/admin/NewsManager.tsx`**
- Same: replace "Image URL" with file upload
- Upload goes to `/uploads/news/`

**New PHP file: `public/api/admin/upload.php`**
- Generic admin image upload endpoint
- Accepts `folder` param (events, news, gallery)
- Returns the file path
- Validates file type and size (max 5MB)

**File: `src/lib/admin-api.ts`**
- Add `uploadImage(file: File, folder: string)` function

---

### 5. Admin Layout & Dashboard Polish

**File: `src/pages/admin/AdminLayout.tsx`**
- Add nav items: "Event Registrations" (under Submissions or separate), "Database"
- Add site settings link placeholder
- Show current date/time in header

**File: `src/pages/admin/Dashboard.tsx`**
- Add "Event Registrations" stat card
- Add a "System Status" card showing: DB connection status, last submission time, storage usage estimate
- Add direct links in stat cards (click to navigate)

---

### 6. Submissions — Add Event Registrations

**File: `src/pages/admin/Submissions.tsx`**
- Add `{ value: "event_registration", label: "Event Registration" }` to formTypes
- Add `event_registration: ["id", "event_title", "full_name", "email", "phone", "participants", "submitted_at"]` to summaryColumns
- Add column labels for the new fields

---

### Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/forms/EventRegistrationForm.tsx` | Event-specific registration form |
| Create | `src/pages/admin/DatabaseBrowser.tsx` | Full database browser view |
| Create | `public/api/admin/database.php` | DB browser API endpoint |
| Create | `public/api/admin/upload.php` | Generic image upload endpoint |
| Modify | `src/pages/Events.tsx` | Use EventRegistrationForm instead of VolunteerForm |
| Modify | `src/pages/admin/GalleryManager.tsx` | Category filters, custom "others" category |
| Modify | `src/pages/admin/EventsManager.tsx` | Image upload instead of URL input |
| Modify | `src/pages/admin/NewsManager.tsx` | Image upload instead of URL input |
| Modify | `src/pages/admin/Dashboard.tsx` | More stats, clickable cards, system status |
| Modify | `src/pages/admin/AdminLayout.tsx` | Add Database nav item |
| Modify | `src/pages/admin/Submissions.tsx` | Add event_registration type |
| Modify | `src/App.tsx` | Add /admin/database route |
| Modify | `src/lib/admin-api.ts` | Add upload, database browser functions |
| Modify | `public/api/submit-form.php` | Add event_registration case |
| Modify | `public/api/admin/submissions.php` | Add event_registrations table mapping |

### New SQL (run in phpMyAdmin after approval)
```sql
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(255) NOT NULL,
    event_category VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    participants INT DEFAULT 1,
    special_requirements TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

