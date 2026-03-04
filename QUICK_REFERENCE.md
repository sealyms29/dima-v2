# Quick Reference: Deployment Commands & Paths

## Build Commands

```bash
# Build for STAGING (/staging/ subdirectory)
npm run build -- --base=/staging/

# Build for PRODUCTION (root directory)
npm run build

# Development mode (testing locally)
npm run dev
```

---

## cPanel Deployment Paths

### Staging Deployment (for testing)
```
Source (your computer):    dist/*               → Destination: public_html/staging/
                          api/*                →              public_html/staging/api/
                          admin/*              →              public_html/staging/admin/
                          includes/*           →              public_html/staging/includes/
                          
.htaccess File:   .htaccess-staging          →              public_html/staging/.htaccess
```

**Test URL:** `https://yourdomain.com/staging/`

---

### Production Deployment (go-live)
```
Source (your computer):    dist/*               → Destination: public_html/
                          api/*                →              public_html/api/
                          admin/*              →              public_html/admin/
                          includes/*           →              public_html/includes/
                          
.htaccess File:   .htaccess-production       →              public_html/.htaccess
```

**Live URL:** `https://yourdomain.com/`

---

## File Structure After Deployment

### Staging
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

### Production
```
public_html/
├── index.html
├── js/
├── assets/
├── .htaccess
├── api/
├── admin/
├── includes/
├── logs/
├── uploads/
└── staging/          ← Keep for reference
```

---

## Key Configuration Files

### config.php (in includes/)

**For Staging:**
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dima_staging');      // or dima_production
define('DB_USER', 'dima_app');
define('DB_PASS', 'your_password');
define('APP_URL', 'https://yourdomain.com/staging');
```

**For Production:**
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dima_production');
define('DB_USER', 'dima_app');
define('DB_PASS', 'your_password');
define('APP_URL', 'https://yourdomain.com');
```

---

## Database Import Command (SSH)

```bash
# Via SSH - import database.sql
mysql -u dima_app -p dima_production < database.sql

# Export database for backup
mysqldump -u dima_app -p dima_production > backup-$(date +%Y%m%d).sql
```

---

## Permission Commands (SSH)

```bash
# Set directory permissions (after upload)
chmod 755 public_html/staging/logs/
chmod 755 public_html/staging/uploads/
chmod 644 public_html/staging/.htaccess

# For production
chmod 755 public_html/logs/
chmod 755 public_html/uploads/
chmod 644 public_html/.htaccess
```

---

## Test Endpoints

### Forms (POST)
```
Staging:    https://yourdomain.com/staging/api/quotation-create.php
Production: https://yourdomain.com/api/quotation-create.php

Staging:    https://yourdomain.com/staging/api/contact-create.php
Production: https://yourdomain.com/api/contact-create.php

Staging:    https://yourdomain.com/staging/api/complaint-create.php
Production: https://yourdomain.com/api/complaint-create.php
```

### Admin Dashboard
```
Staging:    https://yourdomain.com/staging/admin/
Production: https://yourdomain.com/admin/
```

---

## Testing Checklist (After Deployment)

**Homepage & Navigation**
- [ ] Home page loads
- [ ] About link works
- [ ] Services link works
- [ ] ISO pages load
- [ ] Contact page loads
- [ ] Admin dashboard accessible

**Forms**
- [ ] Quotation form visible
- [ ] Contact form visible
- [ ] Complaint/Appeal form visible
- [ ] Submit button works
- [ ] Error messages display (try empty form)
- [ ] Success screen shows after submit

**Browser Console (F12)**
- [ ] No red errors
- [ ] No 404s for assets
- [ ] No API errors (POST requests show 200)

**Database**
- [ ] phpMyAdmin shows new submissions
- [ ] Data format is correct
- [ ] Timestamps are correct

---

## Common Issues & Quick Fixes

| Issue | Command |
|-------|---------|
| 404 on all pages | Check .htaccess is uploaded, enable mod_rewrite |
| API 404 errors | Verify api/ folder uploaded to staging/ |
| Database connection failed | Check config.php credentials |
| Styles not loading | Hard refresh (Ctrl+Shift+R), check dist/assets/ |
| Forms not submitting | Check Network tab, look for failed requests |
| Permission denied on logs/ | `chmod 755 staging/logs/` |

---

## Rollback Commands (If Needed)

```bash
# Restore from backup (if you have backup.tar.gz)
ssh username@yourdomain.com
cd public_html/
tar -xzf backup-live-[DATE].tar.gz

# Or delete staging on production
rm -rf public_html/staging/

# Or restore full database
mysql -u dima_app -p dima_production < clean-backup.sql
```

---

## Helpful SSH Shortcuts

```bash
# Check error logs in real-time
tail -f public_html/logs/error.log

# See last 50 errors
tail -50 public_html/logs/error.log

# Check disk space
df -h

# Check file permissions
ls -la public_html/staging/

# Restart Apache (if allowed by hosting)
sudo systemctl restart apache2
```

---

## Document References

Keep these bookmarked:
- **STAGING_DEPLOYMENT_CHECKLIST.md** - Step-by-step for staging deploy
- **GO_LIVE_PLAN.md** - How to go live from staging
- **ROLLBACK_PLAN.md** - Emergency procedures
- **DEPLOYMENT_STRATEGY_SUMMARY.md** - Overview of approach

---

## Contact Information

**Hosting Support:**
- Provider: [Your hosting company]
- Support Line: [Number]
- Support Email: [Email]

**Project Resources:**
- GitHub: [Your repo URL]
- Local dev: npm run dev
- Staging: https://yourdomain.com/staging/
- Production: https://yourdomain.com/

---

**Print this page or save as bookmark for quick reference during deployment!**
