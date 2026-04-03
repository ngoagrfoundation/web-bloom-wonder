

## .htaccess Update Needed — Cache-Busting for index.html

Your current `.htaccess` routing rules are correct. The only addition needed is **cache-busting headers for `index.html`** so that after each deployment, browsers fetch the latest version instead of serving a stale cached copy (which references old JS/CSS bundles).

### Add This Block

Add these lines **before** the `RewriteEngine On` line:

```apache
# Prevent browser caching of index.html
<Files "index.html">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</Files>
```

### Final .htaccess Should Be:

```apache
# Prevent browser caching of index.html
<Files "index.html">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</Files>

RewriteEngine On

# Allow API and uploads to pass through
RewriteRule ^api/ - [L]
RewriteRule ^uploads/ - [L]

# Serve actual FILES only (not directories)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Everything else goes to React
RewriteRule . /index.html [L]
```

### Why This Fixes Your Problem

- Vite already hashes JS/CSS filenames (e.g., `index-BK_dvn21.js`), so those cache fine
- But `index.html` itself has no hash — browsers cache it and keep loading old bundles
- The `no-cache` header forces the browser to always check for a fresh `index.html`

### Note

If your cPanel server doesn't have `mod_headers` enabled, the `<Files>` block will cause a 500 error. In that case, wrap it:

```apache
<IfModule mod_headers.c>
  <Files "index.html">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </Files>
</IfModule>
```

Everything else in your `.htaccess` is correct — no other changes needed.

