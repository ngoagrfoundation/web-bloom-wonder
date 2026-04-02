

## Separate MySQL Tables for Each Form + Updated PHP & Admin UI

### Overview

Replace the single `form_submissions` table with 7 dedicated tables — one per form type — each with explicit columns for every input field. Update the PHP API to insert into the correct table, and update the admin dashboard to display all fields per form type.

### SQL Schema (copy-paste into phpMyAdmin)

```sql
-- Drop the old generic table (backup first if it has data)
-- DROP TABLE IF EXISTS form_submissions;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteer_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    location VARCHAR(200) NOT NULL,
    initiatives TEXT NOT NULL,
    availability TEXT NOT NULL,
    experience TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    partnership_interest TEXT NOT NULL,
    message TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS adopt_student_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    city VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    message TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_challenge_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    location VARCHAR(200) NOT NULL,
    challenge_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    people_affected VARCHAR(50),
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sanskrit_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT,
    age VARCHAR(10),
    batch VARCHAR(50),
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dental_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT,
    problem TEXT,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The existing `donations`, `gallery_images`, `events`, and `admin_users` tables stay unchanged.

### Security Note (RLS equivalent)

MySQL doesn't have RLS like PostgreSQL/Supabase. Since this is a cPanel PHP project, security is enforced at the **PHP layer**:
- All admin endpoints already call `requireAdmin()` which checks PHP session
- Public form endpoints only allow INSERT (no SELECT/DELETE)
- No direct database access from the frontend

This is the standard and correct approach for cPanel/PHP projects.

---

### Files to Change

#### 1. `public/api/submit-form.php` — Route to correct table
Instead of inserting everything into `form_submissions` with JSON, parse each `form_type` and INSERT into the matching table with explicit columns.

#### 2. `public/api/admin/submissions.php` — Read from separate tables
Update to query from the correct table based on `form_type` filter. When "All Types" is selected, query each table and merge results. Return explicit column data instead of a JSON blob.

#### 3. `src/pages/admin/Submissions.tsx` — Show all fields per form
Update the admin UI to display a detailed table with all columns visible (not just a "Summary" column). When filtering by form type, show columns specific to that form. Add a detail view/expandable row to see every field.

#### 4. `src/lib/admin-api.ts` — Update `getSubmissions` response type
Update the TypeScript interface to handle the new response format with explicit fields instead of a `data: Record<string, unknown>` JSON blob.

#### 5. `src/hooks/useFormSubmit.ts` — No changes needed
The hook already sends `formType` and data correctly. The PHP backend handles the routing.

---

### How Each Form Maps to Its Table

| Form | `formType` sent | Table | Columns |
|------|----------------|-------|---------|
| Contact Us | `contact` | `contact_submissions` | name, email, phone, message |
| Volunteer | `volunteer` | `volunteer_submissions` | full_name, email, phone, location, initiatives, availability, experience |
| Partner | `partner` | `partner_submissions` | organization_name, contact_person, email, phone, organization_type, partnership_interest, message |
| Adopt Student | `adopt_student` | `adopt_student_submissions` | sponsor_name, email, phone, city, grade_level, duration, message |
| Report Challenge | `report_challenge` | `report_challenge_submissions` | name, phone, email, location, challenge_type, description, people_affected |
| Sanskrit Registration | `sanskrit_registration` | `sanskrit_registrations` | name, mobile, address, age, batch |
| Dental Registration | `dental_registration` | `dental_registrations` | name, mobile, address, problem |
| Donate | (via record-donation.php) | `donations` | razorpay_payment_id, donor_name, donor_email, donor_phone, amount, donation_type, pan_number, status |

---

### Steps After Approval

1. I will update `submit-form.php`, `admin/submissions.php`, `Submissions.tsx`, and `admin-api.ts`
2. You run the SQL in phpMyAdmin to create the 7 new tables
3. You can optionally keep `form_submissions` as a backup, or drop it later
4. Deploy updated code to cPanel and test

