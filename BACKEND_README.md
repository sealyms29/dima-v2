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

## Future Enhancements

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
