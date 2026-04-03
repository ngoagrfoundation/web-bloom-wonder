
## Why the forms are not working

### Actual blocker
The real issue is the `500 Internal Server Error` from `public/api/submit-form.php`.

From the current codebase, the most likely root cause is a **database schema mismatch**:

- `submit-form.php` inserts into dedicated tables:
  - `contact_submissions`
  - `volunteer_submissions`
  - `partner_submissions`
  - `adopt_student_submissions`
  - `report_challenge_submissions`
  - `sanskrit_registrations`
  - `dental_registrations`
  - `event_registrations`
- but `public/api/setup.php` only creates:
  - `admin_users`
  - `form_submissions`
  - `donations`
  - `gallery_images`
  - `events`

So if your server was initialized from `setup.php`, the main form tables are missing or incomplete, which explains the 500s.

### The other console messages
These are not the main reason submissions fail:

- **`X-Frame-Options may only be set via an HTTP header`**
  - non-blocking
  - current `index.html` in the repo does **not** contain that invalid meta tag anymore
  - if you still see it on live, the server is serving an older build or another template is injecting it

- **`Missing Description or aria-describedby for DialogContent`**
  - accessibility warning, not a submission blocker
  - homepage `GetInvolvedSection.tsx` already has descriptions
  - but several other dialogs still do not, so the warning can still appear

## Plan to fix

### 1. Fix the backend schema first
Verify or create the submission tables with the columns the code expects.

Minimum requirement for each submission table:
- form-specific fields
- `status VARCHAR(20) DEFAULT 'new'`
- `ip_address VARCHAR(45)`
- `submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

Also verify `site_settings` exists, because `submit-form.php` reads it after insert for email notifications.

Important: if your tables use `created_at` instead of `submitted_at`, form inserts may work, but the admin submissions module will remain inconsistent.

### 2. Align frontend payload keys with PHP
There are field-name mismatches that can save blank values even after the 500 is fixed:

- `src/components/forms/VolunteerForm.tsx`
  - sends `fullName`
  - PHP reads `name` or `full_name`

- `src/components/forms/PartnerForm.tsx`
  - sends `organization`
  - PHP reads `organizationName` or `organization_name`

Best fix: standardize request keys to match backend expectations.

### 3. Clean up the remaining dialog warnings
Add `DialogDescription` or explicitly unset `aria-describedby` in dialogs still missing it:

- `src/components/HeroSection.tsx`
- `src/components/ProgramPageLayout.tsx`
- `src/components/FocusPageLayout.tsx`
- `src/components/ReelsSection.tsx`
- `src/components/YouTubeSection.tsx`
- admin dialogs in:
  - `src/pages/admin/ReelsManager.tsx`
  - `src/pages/admin/NewsManager.tsx`
  - `src/pages/admin/TestimonialsManager.tsx`

### 4. Recheck deployment freshness
Because the repo already:
- removed the invalid X-Frame meta issue from `index.html`
- added dialog descriptions in `GetInvolvedSection.tsx`

the live site may still be serving an older build.

So after code fixes:
- rebuild
- redeploy latest `index.html` + assets
- hard refresh browser cache

## Files to update

- `public/api/setup.php`
  - extend it so it creates all active form tables, not just the old basic set

- `public/api/submit-form.php`
  - keep inserts aligned with actual payload keys
  - optionally support both camelCase and snake_case consistently

- `src/components/forms/VolunteerForm.tsx`
  - send backend-compatible key names

- `src/components/forms/PartnerForm.tsx`
  - send backend-compatible key names

- dialog files listed above
  - add missing descriptions

## Database work you likely need to do
Yes — you almost certainly need database updates if you have not already manually created all form submission tables.

Most likely required:
- create missing tables
- add `status`
- add `submitted_at`
- verify column names match the PHP insert statements

## Expected result after this fix
- Volunteer, Partner, Adopt Student, Report a Challenge, and Contact forms stop returning 500
- saved data appears correctly instead of blank key fields
- admin submissions stays compatible with filtering/status
- console warnings reduce to near zero

## Technical note
Optional cleanup: simplify `src/lib/api.ts` to use relative `/api` for deployed environments too, so `www.agrfoundation.ngo` does not need to post cross-origin to `https://agrfoundation.ngo/api`.

Also, `submit-form.php` already returns a JSON `debug` message on PDO failure, so the exact missing table/column can be confirmed from the Network tab response body during implementation.
