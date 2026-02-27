# DIMA Backend Setup Guide

This guide walks through setting up the PHP/MySQL backend for the DIMA website on cPanel hosting.

## Prerequisites

- cPanel hosting with PHP 7.4+ and MySQL/MariaDB
- SSH access to your hosting account (recommended)
- FTP access (if SSH not available)
- phpMyAdmin or MySQL CLI access

## Step-by-Step Setup

### 1. Database Setup

#### Option A: Using phpMyAdmin (UI)

1. Log into cPanel → phpMyAdmin
2. Click "Databases" tab
3. Create a new database (e.g., `dima_production`)
4. Create a new MySQL user:
   - Username: `dima_app`
   - Password: Generate a strong password
5. Add user to database with "All Privileges"
6. Go to the newly created database
7. Click "Import" tab
8. Upload `database.sql` from this project
9. Click "Go" to execute

#### Option B: Using MySQL CLI (Terminal)

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE dima_production DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'dima_app'@'localhost' IDENTIFIED BY 'your_strong_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON dima_production.* TO 'dima_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u dima_app -p dima_production < database.sql
```

### 2. File Deployment

#### Using FTP:

1. Connect to your hosting via FTP client (Filezilla recommended)
2. Navigate to `/public_html/` or your website root
3. Upload all backend files:
   - `/includes/config.php` - Edit with your database credentials
   - `/includes/Database.php`
   - `/includes/SecurityHelper.php`
   - `/includes/bootstrap.php`
   - `/api/*.php` - All API endpoint files
   - `/admin/*.php` - All admin panel files
   - `/admin/.htaccess`
   - `/api/.htaccess`
   - Create `/logs/` directory (ensure writable)
   - Create `/uploads/` directory (ensure writable)

#### Using SSH:

```bash
# FTP/SCP files to server, then set permissions
cd /home/username/public_html/

# Set permissions for writable directories
chmod 755 logs/
chmod 755 uploads/
chmod 755 admin/
chmod 755 api/

# Verify file ownership
chown username:username logs/
chown username:username uploads/
```

### 3. Configuration

#### Edit `/includes/config.php`:

Replace placeholder values with your actual credentials:

```php
<?php
define('DB_HOST', 'localhost');           // Usually 'localhost'
define('DB_NAME', 'dima_production');     // Your database name
define('DB_USER', 'dima_app');            // Your database user
define('DB_PASS', 'your_password');       // Your database password

define('APP_NAME', 'DIMA');
define('APP_URL', 'https://yourdomain.com');
define('ADMIN_URL', 'https://yourdomain.com/admin');

define('TIMEZONE', 'Asia/Kuala_Lumpur');

// ... rest of configuration
```

### 4. Admin Panel Protection

The admin panel (`/admin/*`) should be protected. **Choose ONE method:**

#### Method A: cPanel Directory Privacy (Recommended)

1. Log into cPanel
2. Look for "Directory Privacy" or "Password Protect Directories"
3. Navigate to `/public_html/admin/`
4. Enable protection:
   - Check "Password protect this directory"
   - Enter a realm name (e.g., "DIMA Admin")
   - Set username and password
5. Create/update `.htpasswd` file if needed

#### Method B: Manual .htaccess Setup

Add to `/admin/.htaccess`:

```apache
AuthType Basic
AuthName "DIMA Admin"
AuthUserFile /home/username/public_html/admin/.htpasswd
Require valid-user
```

Create `.htpasswd` file (on server via SSH):

```bash
htpasswd -c /home/username/public_html/admin/.htpasswd admin_username
# Enter password when prompted
```

### 5. Verify Installation

#### Test Database Connection:

Create a temporary file `/test-db.php`:

```php
<?php
require_once __DIR__ . '/includes/bootstrap.php';

try {
    $result = Database::fetchOne("SELECT 1");
    echo "✓ Database connection successful";
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage();
}
```

Access via browser: `https://yourdomain.com/test-db.php`

Then delete the file.

#### Test API Endpoints:

```bash
# Create a quotation
curl -X POST https://yourdomain.com/api/quotation-create.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+60123456789",
    "company": "Test Company",
    "message": "This is a test message"
  }'

# Should return JSON with success status
```

#### Test Admin Panel:

1. Navigate to `https://yourdomain.com/admin/`
2. Log in with your credentials (set via Directory Privacy)
3. Verify dashboard loads without errors
4. Click through each admin page

### 6. Frontend Integration

Update React form components to call the PHP API endpoints instead of console.log:

**Example - QuotationForm.tsx:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/quotation-create.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            setSuccess('Quotation submitted successfully');
            // Reset form
            setFormData({...});
        } else {
            setErrors(data.errors || {'general': data.message});
        }
    } catch (error) {
        setErrors({'general': 'Network error'});
    }
};
```

### 7. Email Notifications (Optional)

The `/api/quotation-create.php`, `/api/contact-create.php`, and `/api/complaint-create.php` have placeholders for email notifications.

To enable:

1. Edit the `sendNotificationEmail()` function in each file
2. Configure SMTP or use `mail()` function
3. Update `/includes/config.php` with email settings:

```php
define('NOTIFICATIONS_ENABLED', true);
define('NOTIFICATION_EMAIL', 'admin@dima.com');
define('NOTIFICATION_FROM', 'noreply@dima.com');
```

### 8. Security Best Practices

- [ ] Enable HTTPS (SSL/TLS) for your domain
- [ ] Keep PHP and MySQL updated
- [ ] Set database backups (via cPanel: Backup)
- [ ] Monitor `/logs/error.log` for issues
- [ ] Regularly review admin logs via `/admin-logs.php` (create this if needed)
- [ ] Change admin credentials periodically
- [ ] Review `/includes/config.php` for sensitive data exposure
- [ ] Test all form validations and error handling

### 9. Monitoring & Maintenance

#### Regular Tasks:

```bash
# Check error log
tail -f /home/username/public_html/logs/error.log

# Monitor database size
# In phpMyAdmin: Databases → [Your DB] → Size

# Clear old submissions if needed
# Use admin panel to archive/delete old records

# Test API endpoints monthly
# Document any responses that differ from expected
```

#### Backup Strategy:

1. Set up automatic daily backups via cPanel
2. Keep a local copy of `database.sql` schema
3. Export admin logs periodically for audit trail

### 10. Troubleshooting

#### 500 Internal Server Error

1. Check `/logs/error.log` for PHP errors
2. Verify database credentials in `/includes/config.php`
3. Ensure `logs/` and `uploads/` directories are writable (chmod 755)
4. Check PHP version compatibility (need 7.4+)

#### Database Connection Failed

1. Verify DB_HOST, DB_NAME, DB_USER, DB_PASS are correct
2. Confirm MySQL user has privileges on database
3. Check if MySQL is running: `mysqladmin ping`
4. Test from MySQL CLI: `mysql -u dima_app -p -h localhost dima_production`

#### Admin Panel Won't Load

1. Verify `.htaccess` is in place in `/admin/`
2. Check if mod_rewrite is enabled: Ask hosting support
3. Verify file permissions: `ls -la admin/`
4. Test with browser developer tools (F12) to see console errors

#### CSRF Token Issues

1. Check if session is starting: Debug `$_SESSION` variables
2. Verify `ini_set` settings in `/includes/bootstrap.php`
3. Test with different browsers (cookies enabled?)

### 11. Scaling & Performance

For high volume deployments:

- Consider query optimization with database indexes (already added in schema)
- Implement caching for ISO content blocks (consider Redis)
- Use IP-based rate limiting more aggressively
- Archive old submissions to separate tables
- Monitor slow queries with MySQL slow query log

### 12. Support & Documentation

#### API Endpoints Summary:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/quotation-create.php` | POST | Submit new quotation |
| `/api/contact-create.php` | POST | Submit contact request |
| `/api/complaint-create.php` | POST | Submit complaint/appeal |
| `/api/admin-submissions.php` | GET | List submissions (admin) |
| `/api/admin-submissions-update.php` | PATCH | Update status/notes (admin) |
| `/api/admin-submission-detail.php` | GET | Get single submission (admin) |
| `/api/admin-forms.php` | GET/POST/PATCH/DELETE | Manage forms (admin) |
| `/api/admin-export.php` | GET | Export as CSV (admin) |

#### Admin Pages:

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/admin/` | Overview & recent submissions |
| Submissions | `/admin/submissions.php` | Browse & filter all submissions |
| Submission Detail | `/admin/submission-view.php` | View details & update status |
| Forms | `/admin/forms.php` | Manage downloadable forms |
| Content | `/admin/content.php` | Toggle content block visibility |

---

For support or issues, check logs at `/logs/error.log` and review the code comments in each PHP file.
