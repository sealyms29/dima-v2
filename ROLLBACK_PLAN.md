# Rollback Plan: Emergency Procedures

This document provides step-by-step procedures for rolling back to staging or backup if critical issues occur after go-live.

## When to Rollback

Rollback is needed if:
- Website won't load or shows 500 errors
- Forms are not submitting (404 on API)
- Admin dashboard inaccessible
- Database corrupted (data loss)
- Security breach detected
- Performance severely degraded
- Any critical business function broken

**Decision Time: Make rollback decision within 15 minutes of detecting issue.**

---

## Quick Health Check (Do This First)

Before deciding to rollback, verify the issue:

### 1. Server Status
```bash
# Via SSH
ssh username@yourdomain.com

# Check disk space
df -h

# Check if services running
systemctl status apache2  # or httpd

# Check error logs
tail -50 public_html/logs/error.log
```

### 2. Browser Check
- [ ] Open https://yourdomain.com in incognito/private window
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check Console (F12 → Console tab) for errors
- [ ] Check Network tab for failed requests (red items)

### 3. Test Database Connection
Via cPanel phpMyAdmin:
- [ ] Can connect to database
- [ ] Tables exist and have data
- [ ] Can run basic queries

**If these checks pass:** Issue may be temporary or localized to specific user. Monitor for 5 minutes before rollback.

---

## Rollback Decision Matrix

| Issue | Severity | Action |
|-------|----------|--------|
| Single page won't load | Low | Check .htaccess, restart Apache |
| Forms not submitting but pages load | Medium | Check API files, check config.php |
| All pages show 500 error | High | **ROLLBACK** |
| Database inaccessible | High | **ROLLBACK** to staging |
| Security breach detected | Critical | **IMMEDIATE ROLLBACK** |

---

## Rollback Option 1: Quick File Restore (5 minutes)

**Best for:** File corruption, wrong .htaccess, missing files

### Via SSH

```bash
ssh username@yourdomain.com
cd public_html/

# Step 1: Stop any active processes
# (contact hosting if needed)

# Step 2: Backup corrupted files (for investigation)
mkdir -p backups-corrupted/
mv index.html backups-corrupted/ 2>/dev/null || true
mv js/ backups-corrupted/ 2>/dev/null || true
mv assets/ backups-corrupted/ 2>/dev/null || true
mv .htaccess backups-corrupted/ 2>/dev/null || true

# Step 3: Restore from backup created before go-live
tar -xzf backup-live-[DATE].tar.gz

# Step 4: Verify restoration
ls -la index.html js/ assets/ .htaccess

# Step 5: Restart web server (if allowed)
# Most shared hosting restarts automatically after 1-2 minutes
```

### Via FTP (FileZilla)

1. Connect to FTP → `/public_html/`
2. Right-click on corrupted files → Delete:
   - `index.html`
   - `js/` folder
   - `assets/` folder
   - `.htaccess`
3. Download backup files from local machine
4. Upload to `/public_html/`
5. Reload website in browser (hard refresh: Ctrl+Shift+R)

---

## Rollback Option 2: Full Database Rollback (10 minutes)

**Best for:** Database corruption, data loss

### Prerequisites
- You must have database backup made before go-live
- Backup file: `backup-production-[DATE].sql`

### Restore Database

#### Via cPanel phpMyAdmin

1. Login to cPanel → phpMyAdmin
2. Select database: `dima_production`
3. Click "Operations" tab
4. Click "Drop the database" (will lose recent data)
5. Create new database with same name
6. Import backup SQL file:
   - Click "Import" tab
   - Choose backup file
   - Click "Go"

#### Via SSH

```bash
ssh username@yourdomain.com

# Step 1: Export current state (for investigation)
mysqldump -u dima_app -p dima_production > corrupted-state-$(date +%Y%m%d-%H%M%S).sql

# Step 2: Drop and recreate database
mysql -u dima_app -p -e "DROP DATABASE dima_production;"
mysql -u dima_app -p -e "CREATE DATABASE dima_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Step 3: Restore from backup
mysql -u dima_app -p dima_production < /path/to/backup-production-[DATE].sql

# Step 4: Verify restoration
mysql -u dima_app -p -e "USE dima_production; SELECT COUNT(*) as count FROM quotations;"
```

### Important Notes
- **You will lose** any submissions made after backup was created
- If you have recent critical data, extract it first and re-enter manually
- Contact hosting support if you need help with database commands

---

## Rollback Option 3: Switch to Staging (3 minutes)

**Best for:** Quickest possible rollback, when you need traffic off production immediately

### Via cPanel Redirects

1. Login to cPanel
2. Addon Domains or Subdomains section
3. Add redirect from yourdomain.com → yourdomain.com/staging/
4. Test that traffic goes to staging
5. Investigate production issues offline

This keeps users on a working version while you fix production.

### Revert Redirect
1. Remove the redirect when production is fixed
2. Clear browser cache (Ctrl+Shift+R)

---

## Rollback Option 4: Restore from cPanel Backup (1-2 hours)

**Best for:** Complete system failure, corruption beyond file level

### Prerequisites
- cPanel must have automatic backups enabled
- Backup must be recent (ideally from before go-live)

### Steps

1. Login to cPanel
2. Backup section ("Backups")
3. If you see "Full Backup Restore", select backup date from before go-live
4. Click "Restore" and confirm
5. cPanel will restore:
   - All files
   - Database
   - Email accounts
   - Configuration

**This may take 30-60 minutes.** Website will be offline during restoration.

---

## Communication During Rollback

### Notify Users
```
Email Subject: Website Temporarily Unavailable

We are experiencing technical difficulties and have temporarily taken the site 
offline for emergency maintenance. We expect to resume service within 1 hour.
Thank you for your patience.

[YourDomain.com team]
```

### Update Status
- Post on social media if applicable
- Post on Slack/Teams if company uses it
- Update voicemail greeting if applicable

---

## Investigation After Rollback

### Find Root Cause

```bash
ssh username@yourdomain.com

# 1. Check error logs
tail -100 public_html/logs/error.log > error-analysis.txt

# 2. Check file permissions
ls -la public_html/ > file-permissions.txt

# 3. Check database integrity
mysql -u dima_app -p dima_production -e "CHECK TABLE quotations; CHECK TABLE contacts; CHECK TABLE complaints;"

# 4. Check .htaccess syntax
# Validate with: apache2ctl configtest
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 500 Internal Server Error | PHP error or permission issue | Check error log, fix .htaccess, check config.php |
| 404 Not Found on forms | API files not uploaded | Re-upload api/ folder |
| Database connection refused | Wrong credentials or database down | Check config.php, verify DB is running |
| Styles/images missing | Assets not built correctly | Rebuild with correct base path |
| .htaccess errors | Rewrite rules broken | Use correct .htaccess-production |
| Permissions denied | Files uploaded with wrong permissions | Fix permissions: chmod 755 logs/ uploads/ |

---

## Communication After Rollback

### Status Update
```
The issue has been resolved and the website is now online.

What happened: [Brief explanation]
Root cause: [Technical cause]
Resolution: [What was done]
Preventative measures: [Steps taken to prevent recurrence]

Thank you for your patience.
```

---

## Prevention for Next Time

After successful rollback and investigation:

### Update Pre-Deployment Checklist
Add test for the issue that caused rollback

### Improve Testing
- Add this scenario to staging tests
- Run extended load tests if performance was issue
- Test database backup/restore procedure

### Improve Monitoring
- Set up error log alerts (if hosting supports)
- Add uptime monitoring service (e.g., Pingdom, Uptime Robot)
- Monitor database performance metrics

### Document Lessons Learned
```
Date: [Go-live date]
Issue: [What failed]
Time to Resolve: [Duration]
Impact: [User impact]
Root Cause: [Why it happened]
Prevention: [How to prevent next time]
```

---

## Escalation Contacts

**If you can't fix the issue yourself:**

### Hosting Support
- **Emergency Line:** [Your hosting provider emergency number]
- **Email:** [Support email]
- **Portal:** [Support ticket URL]

### Team Resources
- **DevOps Lead:** [Name, phone, email]
- **Backend Developer:** [Name, phone, email]
- **Database Admin:** [Name, phone, email]

---

## Rollback Success Criteria

Rollback is successful when:

- ✅ Website loads and functions
- ✅ Forms work and submit
- ✅ Admin dashboard accessible
- ✅ No console errors
- ✅ Database intact
- ✅ Users can resume

**After confirming success:** Document what went wrong and implement preventative measures before next attempt.

---

## Post-Rollback Timeline

| Time | Action |
|------|--------|
| 0 min | Issue detected, rollback initiated |
| 5 min | Files restored from backup |
| 10 min | Database verified intact |
| 15 min | Website accessible, users notified |
| 1 hour | Root cause analysis complete |
| 4 hours | Fix implemented in staging |
| 8 hours | Fix tested in staging |
| Next day | Attempt go-live again with fix |

---

## Final Checklist

Before attempting go-live again after rollback:

- [ ] Root cause identified and documented
- [ ] Fix implemented and tested in staging
- [ ] Backup created again (fresh backup)
- [ ] Monitoring alerts configured
- [ ] Team briefed on what went wrong
- [ ] Plan modified to prevent recurrence
- [ ] Load test passed
- [ ] Database verification step added to checklist
- [ ] New .htaccess tested locally
- [ ] Config.php verified for all environments
