

## Update config.php with Real Database Credentials

### Change

**File**: `public/api/config.php`

Replace the placeholder values with the actual cPanel MySQL credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'agrfound_maindb');
define('DB_USER', 'agrfound_dbuser');
define('DB_PASS', 'BxwV#XFZlx5z.');
```

Everything else in the file (CORS headers, PDO connection function, auth helper, JSON helper) stays exactly the same.

### After Deployment

1. Upload the updated `config.php` to your cPanel `public_html/api/` directory
2. Visit `https://agrfoundation.ngo/api/setup.php` to create tables
3. You should see `{"success": true, "message": "..."}` instead of the connection error
4. Delete `setup.php` immediately after

### Security Note

Your database password is now stored in the codebase. This is standard for cPanel/PHP projects, but make sure your `.gitignore` or repository settings prevent this file from being publicly visible if using a public GitHub repo.

