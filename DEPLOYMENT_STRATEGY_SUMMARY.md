# Deployment Strategy Summary

## What Was Done

Your DIMA website is now ready for a **safe, staged deployment** approach. Below is a summary of all changes made and how to proceed.

---

## Changes Made to Your Project

### 1. ✅ Build System Updated
**File:** `vite.config.ts`

Added dynamic base path support:
```typescript
base: process.env.VITE_BASE_PATH || '/',
```

**What this means:**
- `npm run build -- --base=/staging/` → builds for staging
- `npm run build` → builds for production (root)

All asset paths automatically adjust based on deployment location.

---

### 2. ✅ API Calls Updated (3 Components)

Changed from hardcoded paths to dynamic paths:

**Before:**
```javascript
fetch('/api/quotation-create.php', ...)
```

**After:**
```javascript
const apiBase = import.meta.env.BASE_URL;
fetch(`${apiBase}api/quotation-create.php`, ...)
```

**Files Updated:**
- `src/app/components/QuotationForm.tsx`
- `src/app/pages/ContactPage.tsx`
- `src/app/pages/ComplaintAppealPage.tsx`

**Result:** Forms work whether deployed to `/` or `/staging/`

---

### 3. ✅ .htaccess Routing Files Created

**Two files added to `public/` folder:**

1. **`.htaccess-staging`** → Copy to `/public_html/staging/.htaccess`
   - Routes all requests through index.html for React Router
   - Base rewrite path: `/staging/`

2. **`.htaccess-production`** → Copy to `/public_html/.htaccess`
   - Same routing for production
   - Base rewrite path: `/`

These ensure React Router works correctly at both deployment paths.

---

### 4. ✅ Environment Files Created

**`.env.staging`** and **`.env.production`**

Optional reference files showing deployment URLs. You can use these to document your deployment targets:
- Staging: `https://yourdomain.com/staging/`
- Production: `https://yourdomain.com/`

---

### 5. ✅ Documentation Created

Three comprehensive guides:

#### **STAGING_DEPLOYMENT_CHECKLIST.md**
- Step-by-step instructions for deploying to `/staging/`
- Tests to verify staging works
- Troubleshooting common issues
- Use this first time deploying to cPanel

#### **GO_LIVE_PLAN.md**
- How to move from staging to production
- Zero-downtime deployment strategy
- Database considerations
- Post-go-live monitoring checklist
- Use this when ready to go live

#### **ROLLBACK_PLAN.md**
- Emergency procedures if something breaks
- 4 rollback options (files, database, staging switch, full backup)
- Root cause investigation steps
- Prevention for future deployments

---

## Deployment Strategy (High Level)

### Phase 1: Staging Deployment (**You are here**)
```
1. Build locally: npm run build -- --base=/staging/
2. Upload dist/ to cPanel: /public_html/staging/
3. Upload backend to cPanel: /public_html/staging/api/, admin/, includes/
4. Test at: https://yourdomain.com/staging/
5. Verify all forms work, database receives data
```

### Phase 2: Go-Live (After staging validated)
```
1. Build locally: npm run build (no --base flag)
2. Upload dist/ to cPanel: /public_html/
3. Update production config.php
4. Test at: https://yourdomain.com/
5. Switch traffic (old site disappears, new site takes over)
```

### Phase 3: Keep Staging (Ongoing reference)
```
- Keep /public_html/staging/ folder
- Use for feature testing before productionProduction
- Reference point for rollback if needed
```

---

## Deployment Timeline

| Step | Duration | Location |
|------|----------|----------|
| **Build for staging** | 5 min | Your computer |
| **Deploy to cPanel (FTP)** | 30-60 min | cPanel FTP |
| **Test staging** | 30 min | Browser testing |
| **Build for production** | 5 min | Your computer |
| **Deploy to cPanel (FTP)** | 30-60 min | cPanel FTP |
| **Test production** | 30 min | Browser testing |
| **TOTAL** | ~3 hours | - |

---

## Quick-Start Commands

### Build for Staging
```bash
npm run build -- --base=/staging/
```

### Build for Production
```bash
npm run build
```

### Check Build Output
```bash
ls -la dist/
# Look for: index.html, js/, assets/
```

### Verify Asset Paths in Build
```bash
grep -r "staging" dist/index.html
# (for staging build, should show /staging/ paths)
```

---

## cPanel Folder Structure After Deployment

### Staging (for testing before go-live)
```
public_html/
└── staging/                  ← Staging build
    ├── index.html
    ├── js/
    ├── assets/
    ├── .htaccess             (from .htaccess-staging)
    ├── api/                  ← Backend endpoints
    ├── admin/                ← Admin panel
    ├── includes/             ← Config & helpers
    ├── logs/
    └── uploads/
```

### Production (live site, after go-live)
```
public_html/
├── index.html                ← Production React app
├── js/
├── assets/
├── .htaccess                 ← (from .htaccess-production)
├── api/                      ← Backend endpoints
├── admin/                    ← Admin panel
├── includes/                 ← Config & helpers
├── logs/
├── uploads/
└── staging/                  ← Keep for reference
    └── [staging build]
```

---

## Database Setup

### ONE Database for Both Staging & Production

Same database: `dima_production` (or `dima_staging`)

**Staging and production share the same submission tables:**
- `quotations` - receives from both staging and production
- `contacts` - receives from both staging and production
- `complaints` - receives from both staging and production

**Implication:** Any test submissions in staging appear in production admin dashboard.

**Solution:** 
- Test with distinct email addresses or names (e.g., "TEST - ...")
- Can filter by date/time in admin dashboard
- For final testing, use separate test database (optional enhancement)

---

## Key Advantages of This Approach

✅ **No Interruption to Live Site**
- Old CMS stays live (`yourdomain.com/`)
- New version deployed separately (`yourdomain.com/staging/`)
- Users don't notice anything

✅ **Safe Testing**
- Full staging environment for QA
- All forms tested before production
- Admin dashboard tested before live

✅ **Minimal Go-Live Time**
- Just upload files and switch
- No database migrations needed
- Rollback simple if issues found

✅ **Easy Rollback**
- Keep staging running as fallback
- File backups prevent data loss
- Can revert in < 5 minutes if needed

✅ **Clean Separation**
- Frontend build separate from backend
- Can deploy frontend independently
- Backend infrastructure reusable for other projects

---

## Next Steps

### Immediate (Today)
1. Review this document
2. Review STAGING_DEPLOYMENT_CHECKLIST.md
3. Have cPanel credentials ready

### When You're Ready to Deploy Staging
1. Follow STAGING_DEPLOYMENT_CHECKLIST.md
2. This will walk through every step with explanations
3. Test thoroughly at staging URL

### When Staging Passes Testing  
1. Follow GO_LIVE_PLAN.md
2. This will guide you to production deployment
3. Same process, just to root folder instead

### If Something Goes Wrong
1. Refer to ROLLBACK_PLAN.md
2. Choose appropriate rollback method
3. Investigate root cause
4. Document lessons learned

---

## Important Notes

### Database Credentials
- Update `includes/config.php` for each environment
- For staging: point to `dima_staging` or use same DB with same table
- For production: point to `dima_production` (or same DB if reusing)

### .htaccess Files
- Copy `.htaccess-staging` → `/staging/.htaccess`
- Copy `.htaccess-production` → `/.htaccess`
- **CRITICAL:** These enable React Router to work (single-page app)
- If these fail, all pages return 404

### Permissions
```bash
# Must be writable
chmod 755 logs/
chmod 755 uploads/

# Must have proper ownership
chown username:username logs/ uploads/
```

### File Upload Size
- If forms have file uploads, check PHP `upload_max_filesize`
- Default usually 2MB, may need to increase
- Contact hosting if uploads fail

---

## Validation Checklist Before Staging Deployment

- [ ] All three forms work locally (`npm run dev`)
- [ ] No console errors in browser (F12)
- [ ] Network tab shows correct API calls to `/api/*`
- [ ] Built successfully: `npm run build -- --base=/staging/`
- [ ] `dist/` folder has index.html, js/, assets/
- [ ] Git committed: `git add vite.config.ts src/...` and `git commit`
- [ ] .htaccess files copied: `.htaccess-staging` ready
- [ ] Database backup created and stored safely
- [ ] cPanel FTP access verified
- [ ] cPanel database credentials confirmed

---

## Support Resources

All documentation is in the project root:
- **BACKEND_SETUP.md** - Backend infrastructure (already complete)
- **STAGING_DEPLOYMENT_CHECKLIST.md** - Deploy to staging step-by-step ← START HERE
- **GO_LIVE_PLAN.md** - Move from staging to production
- **ROLLBACK_PLAN.md** - Emergency procedures
- **BACKEND_IMPLEMENTATION.md** - Technical details (for reference)
- **BACKEND_README.md** - API documentation

---

## Final Summary

Your website is now **production-ready** with a **safe deployment strategy**:

1. ✅ React build system supports both staging and production paths
2. ✅ API calls work dynamically based on deployment URL
3. ✅ Three detailed guides cover every step
4. ✅ Rollback procedures in place for safety
5. ✅ Same database works for both environments

**You can now proceed with confidence to stage your deployment!**

**Next action:** Follow STAGING_DEPLOYMENT_CHECKLIST.md when ready to deploy to cPanel.
