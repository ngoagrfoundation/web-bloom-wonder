

## Complete Backend Integration — All Pending Code Changes

Since the cPanel setup is done (domain, subdomain redirect, files uploaded, DB tables exist), the remaining work is purely code changes that were planned but never applied.

---

### Problem Summary

1. **`config.php`** hides the real DB error — need temporary diagnostics + `127.0.0.1` fallback
2. **`api.ts`** uses `window.location.origin` — breaks on admin subdomain
3. **`useAdminAuth.ts`** shows misleading "Make sure you are on the live site" error
4. **`admin-api.ts`** crashes on non-JSON responses (PHP errors return HTML)
5. **All 5 forms** still submit to Google Sheets first — need PHP-only submission
6. **`.htaccess`** is missing — React routes will 404 on page refresh

---

### Changes (8 files modified, 2 new files)

#### 1. `public/api/config.php` — Add DB diagnostics + host fallback
- Try `localhost` first, then `127.0.0.1`
- Temporarily include the actual PDO error message in the JSON response so you can see exactly why it fails
- Once working, we revert to the generic error

#### 2. `public/.htaccess` — New file for Apache/React routing
- Pass `/api/` and `/uploads/` requests through to PHP/files
- Route everything else to `index.html` for React Router

#### 3. `src/lib/api.ts` — Fix API base URL
- Use `https://agrfoundation.ngo/api` in production instead of `window.location.origin`
- This ensures admin subdomain calls the correct API

#### 4. `src/lib/admin-api.ts` — Handle non-JSON responses
- Check response content-type before calling `.json()`
- Return readable error if PHP returns HTML/text

#### 5. `src/hooks/useAdminAuth.ts` — Fix error message
- Replace "Make sure you are on the live site" with the actual server error

#### 6. `src/hooks/useFormSubmit.ts` — New hook (replaces Google Sheets)
- Same security features (honeypot, cooldown, content checks)
- Submits directly to `/api/submit-form.php` only
- No Google Sheets dependency

#### 7. Update all 5 form components
- `ContactForm.tsx` — remove `SCRIPT_URL`, use `useFormSubmit` instead of `useGoogleSheetForm`
- `VolunteerForm.tsx` — same
- `PartnerForm.tsx` — same
- `AdoptStudentForm.tsx` — same
- `ReportChallengeForm.tsx` — same

#### 8. `src/hooks/useGoogleSheetForm.ts` — Can be deleted or kept unused
- No longer imported by any form after migration

---

### After Deployment — Testing Steps

1. Visit `https://agrfoundation.ngo/api/setup.php` — should now show a detailed error or success
2. If it shows an error with details, share the message and we fix it
3. If it succeeds, login at `https://agrfoundation.ngo/admin` with `admin` / `AGR@admin2025`
4. Test one form submission and check it appears in the admin dashboard
5. Delete `setup.php` from cPanel

