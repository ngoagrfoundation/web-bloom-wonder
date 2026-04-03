

## Fix Form Errors, Dialog Warnings, and Hero Height

### Root Cause Analysis

| Issue | Cause | Fix |
|-------|-------|-----|
| Forms returning 500 | PHP `submit-form.php` crashes on the production server — likely missing database tables (`volunteer_submissions`, `partner_submissions`, `adopt_student_submissions`, `report_challenge_submissions`) | Provide SQL to create all required tables; also add `lovableproject.com` to `isPreview` check in `api.ts` |
| "X-Frame-Options may only be set via meta" warning | `index.html` line 16 has `<meta http-equiv="X-Frame-Options">` which browsers ignore (must be an HTTP header) | Remove that meta tag |
| "Missing Description for DialogContent" warning | Radix Dialog requires a `DialogDescription` inside `DialogContent` for accessibility | Add `DialogDescription` (visually hidden) to all 4 modals in `GetInvolvedSection.tsx` and any other dialogs missing it |
| Hero section too short | Currently `h-[70vh] min-h-[500px]` | Increase to `h-[85vh] min-h-[600px]` |

---

### Implementation

#### 1. Fix `index.html` — Remove invalid meta tag

**File: `index.html`** (line 16)
- Remove `<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />` — this header is already set via `_headers` and `vercel.json`

#### 2. Fix Dialog accessibility warnings

**File: `src/components/GetInvolvedSection.tsx`**
- Add `<DialogDescription className="sr-only">` inside each of the 4 dialog modals (Volunteer, Partner, Report, Adopt)

#### 3. Fix API URL for Lovable preview

**File: `src/lib/api.ts`** (line 4)
- Change: `window.location.hostname.includes('lovable.app')` 
- To: `window.location.hostname.includes('lovable.app') || window.location.hostname.includes('lovableproject.com')`

This ensures the preview correctly routes to the production API.

#### 4. Increase hero section height

**File: `src/components/HeroSection.tsx`** (line 100)
- Change `h-[70vh] min-h-[500px]` to `h-[85vh] min-h-[600px]`

#### 5. SQL tables you must verify exist

The 500 error means your production database is missing one or more tables. Run this in phpMyAdmin (skip any that already exist):

```sql
CREATE TABLE IF NOT EXISTS volunteer_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50),
  location VARCHAR(255), initiatives TEXT, availability TEXT,
  experience TEXT, ip_address VARCHAR(45), status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_name VARCHAR(255), contact_person VARCHAR(255),
  email VARCHAR(255), phone VARCHAR(50), organization_type VARCHAR(100),
  partnership_interest TEXT, message TEXT, ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS adopt_student_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50),
  city VARCHAR(255), grade_level VARCHAR(100), duration VARCHAR(100),
  message TEXT, ip_address VARCHAR(45), status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_challenge_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255), phone VARCHAR(50), email VARCHAR(255),
  location VARCHAR(255), challenge_type VARCHAR(100),
  description TEXT, people_affected VARCHAR(100), ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50),
  message TEXT, ip_address VARCHAR(45), status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sanskrit_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255), mobile VARCHAR(50), address TEXT,
  age VARCHAR(10), batch VARCHAR(100), ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dental_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255), mobile VARCHAR(50), address TEXT,
  problem TEXT, ip_address VARCHAR(45), status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_title VARCHAR(255), event_category VARCHAR(100),
  full_name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50),
  participants INT DEFAULT 1, special_requirements TEXT,
  ip_address VARCHAR(45), status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_type VARCHAR(100), data JSON, ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Files Changed

| File | Change |
|------|--------|
| `index.html` | Remove invalid X-Frame-Options meta tag |
| `src/components/GetInvolvedSection.tsx` | Add `DialogDescription` to all 4 modals |
| `src/lib/api.ts` | Add `lovableproject.com` to preview hostname check |
| `src/components/HeroSection.tsx` | Increase hero height to 85vh |

### After Code Changes
Run the SQL above in phpMyAdmin — the 500 errors will stop once all tables exist.

