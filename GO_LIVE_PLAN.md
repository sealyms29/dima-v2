# Go-Live Plan: Staging to Production

This guide explains how to transition from staging (`/staging/`) to production (root `/`) with minimal downtime and a safe rollback path.

## Pre-Go-Live Checklist

### Staging Fully Tested ✅
- [ ] All pages load correctly
- [ ] All forms submit successfully
- [ ] All links work
- [ ] Admin dashboard functions
- [ ] Database entries are correct
- [ ] Error logs show no critical errors
- [ ] Performance is acceptable

### Stakeholder Approval ✅
- [ ] Business team approved the staging site
- [ ] QA team signed off
- [ ] Content/messaging is correct
- [ ] Client satisfied with look/feel

### Backup Created ✅
- [ ] Database backed up (phpMyAdmin export)
- [ ] Current live site files backed up
- [ ] Backup stored in safe location (e.g., local machine)

---

## Go-Live Execution (Minimal Downtime)

### Phase 1: Prepare Production Build (30 minutes)

**Local Development Machine:**

```bash
# Pull latest from git
git pull origin main

# Install dependencies (if needed)
npm install

# Build for production (root path)
npm run build

# This creates dist/ folder with:
# - index.html (at root level, not /staging/)
# - js/ folder
# - assets/ folder
```

### Phase 2: Upload Production Files (30-60 minutes)

**Using FTP (FileZilla):**

#### Backup Current Live Site (CRITICAL)
1. Connect to FTP
2. Navigate to `/public_html/`
3. Right-click on all current files → Download
4. Save to local folder: `live-site-backup-[date]/`

#### Deploy New Frontend
1. Connect to FTP → `/public_html/`
2. Delete or backup these files/folders (only if they're part of old CMS):
   - `index.html` (if exists)
   - `js/` folder (if exists)
   - `assets/` folder (if exists)
3. Upload from local `dist/`:
   - `index.html` → `/public_html/index.html`
   - `js/` → `/public_html/js/`
   - `assets/` → `/public_html/assets/`
   - `.htaccess-production` → `/public_html/.htaccess`

#### Deploy Backend (if updating)
1. Upload to `/public_html/`:
   - `/api/` (all PHP endpoints)
   - `/admin/` (admin dashboard)
   - `/includes/` (config, helpers)
   - `/logs/` and `/uploads/` (if not already there)

**Using SSH:**
```bash
ssh username@yourdomain.com
cd public_html/

# Backup current site
tar -czf backup-live-$(date +%Y%m%d).tar.gz *.html js/ assets/ .htaccess 2>/dev/null || true

# Copy new build
cp -r /path/to/local/dist/* .

# Copy production .htaccess
cp /path/to/local/public/.htaccess-production .htaccess

# Update backend if needed
cp -r /path/to/local/api/ .
cp -r /path/to/local/admin/ .
cp -r /path/to/local/includes/ .

# Set permissions
chmod 755 logs/ uploads/
chmod 644 .htaccess
```

### Phase 3: Update Production Config (10 minutes)

Edit `/public_html/includes/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dima_production');  // Production database
define('DB_USER', 'dima_app');
define('DB_PASS', 'your_password');
define('APP_URL', 'https://yourdomain.com');  // Production URL
```

### Phase 4: Verify Live Deployment (15 minutes)

Open browser and test:

#### Frontend Tests
```
https://yourdomain.com/
```

- [ ] Home page loads at root URL
- [ ] All pages accessible (About, Services, ISO, Contact, etc.)
- [ ] Images and styling display correctly
- [ ] No console errors (F12)
- [ ] Links work correctly

#### Form Tests
- [ ] Quotation form submits
- [ ] Contact form submits
- [ ] Complaint form submits
- [ ] Data appears in admin dashboard

#### Admin Access
```
https://yourdomain.com/admin/
```
- [ ] Admin login page appears
- [ ] Can login and view submissions

#### API Tests
Check Network tab (F12) for POST requests:
- [ ] `/api/quotation-create.php` - should respond with 200
- [ ] `/api/contact-create.php` - should respond with 200
- [ ] `/api/complaint-create.php` - should respond with 200

#### Database Verification
- [ ] Test form submission
- [ ] Check phpMyAdmin that new data appears in tables

---

## What Happens During Transition

### Before Transition
```
Domain Structure:
https://yourdomain.com/          ← OLD LIVE SITE (CMS)
https://yourdomain.com/staging/  ← NEW REACT SITE (tested)
```

### After Transition
```
Domain Structure:
https://yourdomain.com/          ← NEW REACT SITE (production)
https://yourdomain.com/staging/  ← Kept for reference
https://yourdomain.com/backup/   ← Optional: old site backup
```

### Database Behavior
**Same Database Used:**
- Staging and production share the same `dima_production` database
- All new submissions go to the same tables
- No data duplication needed

---

## Rollback Plan (If Issues Occur)

### Immediate Rollback (< 5 minutes)

If something goes wrong after go-live, quickly revert to staging:

#### Option 1: Quick DNS Revert (if you have staging on subdomain)
```bash
# Via cPanel DNS manager
# Point yourdomain.com back to staging IP temporarily
# Or restore backup via cPanel File Manager
```

#### Option 2: Restore from Backup Files (via FTP)
```bash
# Via SSH
ssh username@yourdomain.com
cd public_html/

# Delete new files
rm -rf js/ assets/ index.html .htaccess

# Restore from backup
tar -xzf backup-live-[date].tar.gz

# Restart web server
# Contact hosting if needed
```

#### Option 3: Manual File Restore (via FTP)
1. Connect to FTP
2. Delete from `/public_html/`:
   - `index.html`
   - `js/` folder
   - `assets/` folder
   - `.htaccess`
3. Restore from local backup files
4. Reload website in browser (Ctrl+Shift+R to bypass cache)

### Database Rollback

If database was corrupted:
```bash
ssh username@yourdomain.com

# Export current database
mysqldump -u dima_app -p dima_production > corrupted-backup-$(date +%Y%m%d).sql

# Restore from previous backup (you made before go-live)
mysql -u dima_app -p dima_production < backup-clean-database.sql
```

---

## Post-Go-Live Monitoring

### Day 1 (Intensive)
- Monitor error logs every hour
- Check form submissions
- Monitor user feedback (email, support)
- Monitor server performance (CPU, memory, disk)

### Week 1 (Daily)
- Review error logs
- Verify all forms working
- Monitor database size
- Check admin dashboard access

### Ongoing (Weekly)
- Backup database on schedule (set via cPanel)
- Review logs for errors
- Monitor uptime

**Commands to check logs:**
```bash
ssh username@yourdomain.com
tail -f public_html/logs/error.log      # Real-time error log
tail -20 public_html/logs/error.log     # Last 20 errors
```

---

## Keeping Staging as Reference

Keep the staging site live for:
- **Testing new features** before production
- **Customer demo/preview** of improvements
- **Fallback reference** if production issues occur

To maintain staging:
- Keep `/public_html/staging/` folder unchanged
- Don't delete staging unless explicitly planned
- Can rebuild staging with new features independently

---

## Timeline

| Phase | Duration | Actions |
|-------|----------|---------|
| **Prepare** | 30 min | Build for production locally |
| **Deploy** | 60 min | Upload files, set permissions |
| **Config** | 10 min | Update config.php for production |
| **Verify** | 15 min | Test all functionality |
| **Total** | **2 hours** | Complete go-live |

**Best time to deploy:** Off-peak hours (late night, early morning) to minimize impact on users.

---

## Success Criteria

Go-live is successful when:

- ✅ Website loads at root URL
- ✅ All pages accessible
- ✅ All forms working and submitting
- ✅ Admin dashboard accessible and showing data
- ✅ No console errors (F12)
- ✅ Database receiving new submissions
- ✅ Error logs clean (no critical errors)

---

## Document Completion

- [ ] Production build created
- [ ] Files uploaded to cPanel
- [ ] config.php updated
- [ ] All tests passed
- [ ] Go-live confidence: **HIGH**
- [ ] Ready to switch traffic

**Next step:** Monitor production for first 24 hours and proceed to [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) if needed.
