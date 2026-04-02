

## Fix: `/admin` Shows Directory Listing Instead of React App

### Root Cause

When you visit `https://agrfoundation.ngo/admin`, Apache finds an actual `/admin` directory on disk (containing your PHP files like `submissions.php`, `donations.php`, etc.) and shows the directory listing instead of routing to React's `index.html`.

The `.htaccess` rule on line 8-10 says: "if file or directory exists, serve it directly" — and `/admin` is a real directory under `public_html/api/admin/`, so Apache serves it.

### Fix: `.htaccess` Update

Update `public/.htaccess` to explicitly exclude only `api/` and `uploads/` from React routing, and remove the generic "serve existing directories" rule that catches `/admin`:

```apache
RewriteEngine On

# Allow API and uploads to pass through to PHP
RewriteRule ^api/ - [L]
RewriteRule ^uploads/ - [L]

# If an actual FILE exists, serve it (but NOT directories)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Route everything else to index.html for React Router
RewriteRule . /index.html [L]
```

The key change: remove `[OR]` and the `-d` (directory) condition. This way only real **files** are served directly. Directory paths like `/admin`, `/admin/dashboard` etc. will fall through to `index.html` and be handled by React Router.

### Issue 2: `admin.agrfoundation.ngo` DNS Not Resolving

This is **not a code issue** — it's a DNS configuration problem. You have two options:

**Option A (Recommended): Skip the subdomain entirely**
- Just use `https://agrfoundation.ngo/admin` — it works with the `.htaccess` fix above
- No DNS changes needed

**Option B: Create the subdomain DNS record**
1. Go to **cPanel → Zone Editor** (or your DNS provider)
2. Add a **CNAME record**:
   - Name: `admin`
   - Value: `agrfoundation.ngo` (or your server's IP as an A record)
3. Wait for DNS propagation (up to 24-48 hours)
4. In **cPanel → Subdomains**, set the document root to `public_html` (same as main domain)
5. Or set up a redirect from `admin.agrfoundation.ngo` → `https://agrfoundation.ngo/admin`

### Summary

| Change | File | What |
|--------|------|------|
| Fix `.htaccess` | `public/.htaccess` | Remove `-d` directory condition so `/admin` routes to React |
| DNS (optional) | cPanel | Add CNAME/A record for `admin` subdomain |

