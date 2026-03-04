# DIMA Backend - Architecture & File Structure

## Overview

The DIMA backend is a PHP/MySQL system providing:
- **Form Submission APIs** for quotations, contact requests, and complaints/appeals
- **Admin Dashboard** for managing submissions and content
- **Secure Configuration** with prepared statements, CSRF protection, rate limiting, and input sanitization
- **Audit Logging** for all admin actions and submissions
- **Content Management** for downloadable forms and ISO program visibility

## Directory Structure

```
/
├── includes/                     # Shared PHP components
│   ├── bootstrap.php             # Initialize app, load dependencies, set up session
│   ├── config.php                # Database & application configuration
│   ├── Database.php              # PDO wrapper with prepared statements
│   └── SecurityHelper.php        # CSRF, sanitization, escaping, hashing, rate limiting
├── api/                          # Public REST-like API endpoints
│   ├── .htaccess                 # Security headers & MIME types
│   ├── quotation-create.php      # POST /api/quotation/create
│   ├── contact-create.php        # POST /api/contact/create
│   ├── complaint-create.php      # POST /api/complaint/create
│   ├── admin-submissions.php     # GET /api/admin/submissions (with filtering)
│   ├── admin-submissions-update.php  # PATCH /api/admin/submissions/{id}
│   ├── admin-submission-detail.php   # GET /api/admin/submissions/{id}
│   ├── admin-forms.php           # GET/POST/PATCH/DELETE /api/admin/forms
│   └── admin-export.php          # GET /api/admin/export (CSV export)
├── admin/                        # Protected admin panel (cPanel Directory Privacy)
│   ├── .htaccess                 # Security headers & auth rules
│   ├── index.php                 # Dashboard overview
│   ├── submissions.php           # Browse submissions with filters
│   ├── submission-view.php       # View & update single submission
│   ├── forms.php                 # Manage downloadable forms
│   ├── content.php               # Manage content visibility
│   ├── mspo_notifications.php    # NEW: List MSPO notifications with search/filter
│   ├── mspo_notification_edit.php    # NEW: Create/edit/delete MSPO notifications
│   ├── mspo_reports.php          # NEW: List MSPO reports with search/filter
│   ├── mspo_report_edit.php      # NEW: Create/edit/delete MSPO reports
│   ├── downloadable_forms.php    # NEW: List downloadable forms with advanced filtering
│   ├── downloadable_form_edit.php # NEW: Create/edit/delete downloadable forms
│   └── logout.php                # Destroy session & redirect
├── uploads/                      # Uploaded files (PDF attachments, etc.)
├── logs/                         # Error & activity logs
├── database.sql                  # MySQL schema (9 tables)
├── BACKEND_SETUP.md              # Deployment guide for cPanel
└── [React frontend files...]     # Keep existing unchanged
```

## Architecture Principles

### 1. Security First

- **Prepared Statements**: All DB queries use parameterized placeholders (?) to prevent SQL injection

## NEW: MSPO Content Management System

### Overview

Three new database tables allow admins to manage public-facing content with draft/publish workflow:

#### Tables
- **`mspo_notifications`** - Public notifications with effective dates
- **`mspo_public_summary_reports`** - Annual/periodic reports organized by year
- **`downloadable_forms`** - Forms and documents grouped by programme

#### Admin Pages (Protected)

**MSPO Notifications:**
- `/admin/mspo_notifications.php` - List all notifications, search by title/content, filter by status
- `/admin/mspo_notification_edit.php` - Create/edit notifications with auto-publish timestamp

**MSPO Reports:**
- `/admin/mspo_reports.php` - List reports, search by title, filter by status, sort by year
- `/admin/mspo_report_edit.php` - Create/edit report summaries with year metadata

**Downloadable Forms:**
- `/admin/downloadable_forms.php` - List forms with advanced filtering (programme, type, status)
- `/admin/downloadable_form_edit.php` - Create/edit forms with file path and version tracking

#### Features
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Draft/Published/Archived status workflow
- ✅ Search and filtering on all list pages
- ✅ Auto-timestamps for published_at when status changes
- ✅ PDO prepared statements for all queries
- ✅ Responsive admin UI with consistent styling
- ✅ Form validation and error handling

#### Public Display Pages

- `/public/mspo-notifications.php` - Show published notifications by date
- `/public/mspo-reports.php` - Show published reports grouped by year  
- `/public/downloadable-forms.php` - Show active forms grouped by programme with download links

Only content marked as `published` (notifications/reports) or `active` (forms) appears publicly.

### Database Schema

```sql
-- MSPO Notifications Table
CREATE TABLE mspo_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    effective_date DATE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- MSPO Public Summary Reports Table
CREATE TABLE mspo_public_summary_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_title VARCHAR(255) NOT NULL,
    summary_text LONGTEXT NOT NULL,
    year INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_year (year)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- Downloadable Forms Table
CREATE TABLE downloadable_forms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_name VARCHAR(255) NOT NULL,
    form_type ENUM('Application Form', 'Questionnaire', 'Other') NOT NULL,
    programme ENUM('MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    version_label VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_programme (programme)
) ENGINE=InnoDB CHARSET=utf8mb4;
```

### Adding Content

1. **Login to admin panel** at `/admin/`
2. **Choose module:**
   - Notifications → Create notification with content and effective date
   - Reports → Create report with year and summary
   - Forms → Upload/link PDF and associate with programme
3. **Save as Draft** to prepare, then change status to **Published** when ready
4. **Public pages update automatically** - content appears on `/public/` pages immediately

### Implementation Details

- All admin pages follow same patterns: list page + edit page
- Validation ensures required fields before saving
- Status changes automatically set `published_at` timestamp
- Delete confirmation dialogs prevent accidental removal
- Database timestamps track creation and modification times
- All user input escaped with `htmlspecialchars()` on output
- All DB queries use PDO prepared statements

---

### 1. Security First

- **Prepared Statements**: All DB queries use parameterized placeholders (?) to prevent SQL injection
- **Input Sanitization**: `SecurityHelper::sanitizeString()` on all user input
- **Output Escaping**: `SecurityHelper::escapeHTML()` for all client output
- **CSRF Protection**: Token generation & verification infrastructure (ready to integrate)
- **Password Hashing**: bcrypt with cost=12 for admin accounts (future use)
- **Rate Limiting**: IP-based, temp file cache (100 requests/hour default)
- **Session Security**: httponly, secure, samesite=strict cookies

### 2. Separation of Concerns

- **`includes/`**: Reusable classes and configuration
- **`api/`**: Stateless REST endpoints with JSON responses
- **`admin/`**: Server-side rendered HTML admin interface
- **Database logic**: Centralized in `Database` class
- **Security logic**: Centralized in `SecurityHelper` class

### 3. Error Handling

- All exceptions caught and logged to `/logs/error.log`
- Client receives JSON error responses (no sensitive details exposed)
- Database errors logged but not displayed to user
- Validation errors returned with specific field messages (422 Unprocessable Entity)

### 4. Transaction Support

- Database changes wrapped in transactions
- Automatic rollback on error (`DBTransaction` helper in bootstrap.php)
- Audit log entry created for each change
- Atomicity guaranteed for multi-step operations

### 5. Audit Trail

- All admin actions logged to `admin_logs` table
- Captures: user_id, action, table_name, record_id, old_value, new_value, ip_address
- Enables accountability and compliance

## Key Classes

### Database Class (`includes/Database.php`)

Singleton PDO wrapper providing:
- `query($sql, $params)` - Execute prepared statement
- `fetchOne($sql, $params)` - Get single row
- `fetchAll($sql, $params)` - Get all rows
- `insert($table, $data)` - Insert and return ID
- `update($table, $data, $where_field, $where_value)` - Update with WHERE clause
- `delete($table, $where_field, $where_value)` - Delete
- `beginTransaction()`, `commit()`, `rollback()` - Transaction control

### SecurityHelper Class (`includes/SecurityHelper.php`)

Static methods for:
- CSRF: `generateCSRFToken()`, `verifyCSRFToken()`, `getCSRFToken()`
- Validation: `sanitizeString()`, `validateEmail()`, `validatePhone()`, `validateURL()`
- Escaping: `escapeHTML()`, `escapeJSON()`
- Hashing: `hashPassword()`, `verifyPassword()`
- Rate Limiting: `checkRateLimit($key, $limit, $window)`
- File Handling: `validateFileUpload()`, `generateSafeFilename()`
- Utilities: `getClientIP()`, `generateToken()`, `format_bytes()`

### APIResponse Helper (`includes/bootstrap.php`)

Static methods for consistent JSON responses:
- `success($data, $message, $code)` - 200/201 with data
- `error($message, $code)` - 400/401/404/500 with message
- `validation($errors)` - 422 with field-level errors
- `send($response)` - Output and exit

### DBTransaction Helper (`includes/bootstrap.php`)

Static methods for transaction management:
- `begin()` - Start transaction
- `commit()` - Commit changes
- `rollback()` - Undo changes
- `isActive()` - Check if transaction active

## Database Schema

### Tables

1. **quotations** - Quotation form submissions
2. **contacts** - Contact form submissions
3. **complaints** - Complaints & appeals submissions
4. **admin_forms** - Downloadable forms & external links
5. **iso_content_blocks** - Content visibility management
6. **admin_users** - Admin user accounts (future use)
7. **admin_logs** - Audit trail of all changes
8. **csrf_tokens** - CSRF token storage (session-like)
9. **Indexes**: On email, status, created_at, programme, form_type, iso_standard, display_order

## Configuration

Edit `includes/config.php` for:
- Database credentials (DB_HOST, DB_NAME, DB_USER, DB_PASS)
- App settings (APP_NAME, APP_URL, ADMIN_URL)
- Timezone (TIMEZONE = 'Asia/Kuala_Lumpur')
- Security: CSRF_TOKEN_LIFETIME, SESSION_LIFETIME, SESSION_SECURE
- File uploads: UPLOAD_MAX_SIZE, UPLOAD_ALLOWED_TYPES
- Email notifications: NOTIFICATIONS_ENABLED, NOTIFICATION_EMAIL

## API Response Format

All API endpoints return JSON in this format:

### Success (200/201)
```json
{
  "success": true,
  "data": { "id": 123, "name": "John" },
  "message": "Operation successful"
}
```

### Validation Error (422)
```json
{
  "success": false,
  "errors": {
    "email": "Invalid email format",
    "phone": "Phone number too short"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to process request"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Integration with React Frontend

Form components should be updated to call API endpoints:

```typescript
// Before (console.log)
const handleSubmit = (e) => {
    console.log(formData);
};

// After (API call)
const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/quotation-create.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!data.success) {
        setErrors(data.errors || {'general': data.message});
    } else {
        setSuccess('Submitted successfully!');
    }
};
```

## Logging

### Error Log (`/logs/error.log`)
- PHP errors and exceptions
- Database errors (sanitized)
- Security issues (rate limiting, CSRF failures)

### Audit Log (Database `admin_logs` table)
- Submission creates/updates
- Admin actions (status changes, form management)
- Content visibility changes
- IP address captured for each action

## Monitoring & Maintenance

### Regular Checks
- Monitor `/logs/error.log` for issues
- Review slowest SQL queries (enable MySQL slow query log)
- Check disk space on `/uploads/` directory
- Verify database backups are running

### Performance Optimization
- Database indexes on frequently queried columns (already in schema)
- Consider caching for ISO content blocks
- Archive old submissions over 1 year old
- Implement query result caching for admin dashboard

## Deployment Guide (Phase 2 - MSPO Content Management)

### Files to Deploy

**Admin Pages** (6 files to `/public_html/admin/`):
```
mspo_notifications.php
mspo_notification_edit.php
mspo_reports.php
mspo_report_edit.php
downloadable_forms.php
downloadable_form_edit.php
```

**Public Pages** (3 files to `/public_html/public/` or `/`):
```
mspo-notifications.php
mspo-reports.php
downloadable-forms.php
```

**Database Migration** (1 file):
```
database_updates.sql
```

### Setup Steps

1. **Upload PHP Files**
   - Upload 6 admin files to cPanel File Manager → `/public_html/admin/`
   - Upload 3 public files to cPanel File Manager → `/public_html/public/`

2. **Import Database Schema**
   - Open cPanel → phpMyAdmin
   - Select database `dima_production`
   - Click "Import" tab
   - Upload `database_updates.sql`
   - Click "Go" to execute migration
   - Verify 3 new tables created: `mspo_notifications`, `mspo_public_summary_reports`, `downloadable_forms`

3. **Verify Installation**
   - Admin pages: `https://staging.example.com/admin/mspo_notifications.php`
   - Public pages: `https://staging.example.com/public/mspo-notifications.php`

4. **Add Navigation Links** (Update React frontend or existing pages to link to):
   - `/public/mspo-notifications.php` from MSPO info page
   - `/public/mspo-reports.php` from MSPO info page  
   - `/public/downloadable-forms.php` from Forms page

### Testing Checklist

- [ ] Admin pages load without errors (check browser console)
- [ ] Can create a new notification/report/form
- [ ] Can edit existing records
- [ ] Can delete records with confirmation
- [ ] Search and filter work on list pages
- [ ] Status changes update published_at timestamp
- [ ] Public pages show published/active content only
- [ ] Database logs show no errors
- [ ] File permissions are correct (644 for PHP, 755 for directories)

---

## Monitoring & Maintenance

## Future Enhancements

- [x] MSPO Notifications Management (Completed Phase 2)
- [x] MSPO Public Summary Reports Management (Completed Phase 2)
- [x] Downloadable Forms Management (Completed Phase 2)
- [ ] Email notifications on form submission
- [ ] Admin user authentication via database (instead of .htaccess)
- [ ] Two-factor authentication for admin panel
- [ ] Advanced search queries saved for reuse
- [ ] Automated report generation & email delivery
- [ ] API rate limiting per user instead of just IP
- [ ] WebSocket integration for real-time admin notifications
- [ ] File upload support for complaint evidence

## Security Checklist

- [ ] Database credentials are strong and unique
- [ ] HTTPS is enabled for all pages
- [ ] Admin panel is password-protected (cPanel Directory Privacy)
- [ ] File permissions: logs/ and uploads/ are writable (755) but not world-readable for sensitive data
- [ ] Regular backups are scheduled
- [ ] Error display is disabled in production (log only)
- [ ] CSRF tokens integrated into admin forms
- [ ] Rate limiting is active
- [ ] Input validation is enforced server-side
- [ ] Output escaping is applied to all client output

---

**Created**: 2024
**PHP Version**: 7.4+
**MySQL Version**: 5.7+ / MariaDB 10.3+
**Timezone**: Asia/Kuala_Lumpur
