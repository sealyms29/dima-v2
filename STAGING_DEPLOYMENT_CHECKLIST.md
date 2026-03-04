# Staging Deployment Checklist

This checklist provides step-by-step instructions for deploying the DIMA website to a staging URL before going live.

## Pre-Deployment (Local Development)

### Step 1: Verify Local Development
- [ ] Run `npm run dev` - site loads at http://localhost:5173
- [ ] Test quotation form submission
- [ ] Test contact form submission  
- [ ] Test complaint/appeal form submission
- [ ] Verify all links work (About, Services, ISO pages, etc.)
- [ ] Open browser DevTools (F12) → Network tab → check API calls go to `/api/...`

### Step 2: Build for Staging
```bash
# Clean previous builds
rm -rf dist/

# Build with staging base path
npm run build -- --base=/staging/

# Verify dist/ folder is created
ls -la dist/
```

### Step 3: Commit Changes to Git
```bash
git add vite.config.ts src/app/components/QuotationForm.tsx src/app/pages/ContactPage.tsx src/app/pages/ComplaintAppealPage.tsx
git commit -m "feat: add staging deployment support with dynamic base paths"
git push origin main
```

---

## cPanel Deployment

### Step 4: Prepare Staging Database (Same as Production)

Using phpMyAdmin:
1. Login to cPanel → phpMyAdmin
2. Create database: `dima_staging` (or reuse `dima_production` if using same DB)
3. Import `database.sql` file:
   - Select the database
   - Click "Import" tab
   - Choose `database.sql` from project root
   - Click "Go"

**Note:** If using same DB as production, skip this step.

### Step 5: Upload Frontend Build to Staging Path

#### Using FTP (FileZilla):

1. Connect to your cPanel hosting via FTP
2. Navigate to `/public_html/`
3. **Create new folder**: `staging` (if it doesn't exist)
4. Enter the `staging` folder
5. Upload all files from local `dist/` folder:
   - `index.html`
   - `js/` folder (all JavaScript bundles)
   - `assets/` folder (CSS, fonts, images)
   - `.htaccess` (use `.htaccess-staging` renamed to `.htaccess`)

```
public_html/
└── staging/
    ├── index.html
    ├── js/
    │   ├── main-xxxxx.js
    │   └── vendor-xxxxx.js
    ├── assets/
    │   ├── style-xxxxx.css
    │   ├── fonts/
    │   └── images/
    └── .htaccess
```

#### Using SSH (if available):
```bash
# Connect via SSH
ssh username@yourdomain.com

# Navigate to web root
cd public_html/

# Create staging directory if needed
mkdir -p staging

# Copy build files
cp -r /path/to/local/dist/* staging/

# Copy .htaccess for staging
cp public/.htaccess-staging staging/.htaccess
```

### Step 6: Upload Backend Files to Staging

1. Upload to `/public_html/staging/`:
   - `/api/` folder (all PHP endpoints)
   - `/admin/` folder (admin dashboard)
   - `/includes/` folder (config, database, security helpers)
   - `/logs/` folder (create empty, must be writable)
   - `/uploads/` folder (create empty, must be writable)

**Directory structure should look like:**
```
public_html/staging/
├── index.html
├── js/
├── assets/
├── .htaccess
├── api/
├── admin/
├── includes/
├── logs/
└── uploads/
```

### Step 7: Set File Permissions

Via SSH or cPanel File Manager:
```bash
# Make logs and uploads writable
chmod 755 public_html/staging/logs/
chmod 755 public_html/staging/uploads/
chmod 755 public_html/staging/api/
chmod 755 public_html/staging/admin/

# Secure .htaccess in api directories
chmod 644 public_html/staging/api/.htaccess
chmod 644 public_html/staging/admin/.htaccess
```

### Step 8: Configure Staging Database Connection

Using SSH or cPanel File Manager:

1. Edit `/public_html/staging/includes/config.php`:
   - Update `DB_HOST` (usually `localhost`)
   - Update `DB_NAME` (e.g., `dima_staging` or `dima_production`)
   - Update `DB_USER` (database username)
   - Update `DB_PASS` (database password)

**Example:**
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dima_staging');  // or 'dima_production' if sharing
define('DB_USER', 'dima_app');
define('DB_PASS', 'your_password');
define('APP_URL', 'https://yourdomain.com/staging');
```

2. Verify permissions:
   ```bash
   chmod 644 public_html/staging/includes/config.php
   ```

### Step 9: Test Staging Deployment

Open browser and navigate to:
```
https://yourdomain.com/staging/
```

#### Test Frontend:
- [ ] Home page loads
- [ ] Navigation links work (About, Services, ISO pages)
- [ ] All images and styling display correctly
- [ ] No 404 errors in console (F12 → Console tab)

#### Test Forms:
- [ ] Quotation form submits successfully
- [ ] Contact form submits successfully
- [ ] Complaint/Appeal form submits successfully
- [ ] Error handling works (test with empty/invalid fields)
- [ ] Check Network tab (F12) → see POST requests to `/staging/api/...`

#### Test Database:
- [ ] Check phpMyAdmin that submissions appear in `quotations`, `contacts`, `complaints` tables
- [ ] Verify data is correctly formatted and sanitized

#### Test Admin Dashboard:
Navigate to: `https://yourdomain.com/staging/admin/`
- [ ] Login page appears
- [ ] Admin dashboard loads (after login)
- [ ] Can view submissions from all three forms

### Step 10: Monitor Staging

Monitor error logs:
```bash
# Via SSH
ssh username@yourdomain.com
tail -f public_html/staging/logs/error.log

# Or check via cPanel File Manager
# Navigate to staging/logs/ and download error.log
```

Check browser console for warnings/errors (F12 → Console).

---

## Troubleshooting

### Issue: "Cannot GET /staging/"
**Cause:** `.htaccess` not uploaded or server doesn't support mod_rewrite
**Fix:**
- Upload `.htaccess` file to staging folder
- Contact hosting support to enable mod_rewrite

### Issue: Forms not submitting / API 404 errors
**Cause:** API files not uploaded or incorrect permissions
**Fix:**
- Verify `/api/` folder exists under `staging/`
- Check all PHP files are uploaded
- Check file permissions

### Issue: Database connection error
**Cause:** config.php has wrong credentials
**Fix:**
- Double-check `DB_NAME`, `DB_USER`, `DB_PASS` in config.php
- Verify database user has proper privileges
- Test connection via phpMyAdmin

### Issue: Styles/images not loading (404 errors)
**Cause:** Assets not built for staging path
**Fix:**
- Re-run: `npm run build -- --base=/staging/`
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `dist/assets/` was uploaded

---

## Deployment Complete ✅

Your staging site is now live at: `https://yourdomain.com/staging/`

**Next Steps:**
- Run comprehensive testing
- Get stakeholder approval
- When ready, follow [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md)
