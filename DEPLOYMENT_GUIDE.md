# DIMA Website — cPanel Deployment Guide

## Architecture Overview

```
dima.my (public_html/)
├── index.html          ← React SPA (built from dist/)
├── assets/             ← React CSS/JS bundles
├── .htaccess           ← SPA routing + security
├── .env.production     ← DB credentials (NOT in git)
├── api/                ← PHP API endpoints
├── admin/              ← PHP admin dashboard
├── includes/           ← PHP shared libraries
├── public/             ← PHP public pages (MSPO docs)
├── uploads/            ← User-uploaded files (PDFs, images)
├── vendor/             ← Composer dependencies (PHPMailer)
└── logs/               ← Error logs
```

---

## Step 1: Create GitHub Repository

```bash
cd C:\xampp\htdocs\DIMA
git init
git add .
git commit -m "Initial commit - DIMA website"
```

Create a **private** repository on GitHub (e.g., `your-username/dima-website`), then:

```bash
git remote add origin https://github.com/your-username/dima-website.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up cPanel

### 2a. Create MySQL Database

1. Go to **cPanel → MySQL Databases**
2. Create a new database (e.g., `youraccount_dima`)
3. Create a new user (e.g., `youraccount_dimauser`)
4. Add the user to the database with **ALL PRIVILEGES**
5. Note down: database name, username, password

### 2b. Import Database

1. Go to **cPanel → phpMyAdmin**
2. Select your new database
3. Click **Import** → upload `database.sql`
4. Then import `database_updates.sql` (for documents, gallery, settings tables)
5. Run the admin user setup:

```sql
-- Add password_hash column if not present
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT '' AFTER email;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) DEFAULT NULL AFTER username;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL AFTER email;

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Insert admin user (change password after first login!)
INSERT INTO admin_users (username, full_name, email, password_hash, role)
VALUES ('admin', 'Administrator', 'your-email@dima.com.my', 
        '$2y$10$Lovg/omPCRt1NxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYour_Hash', 'admin');
```

To generate the bcrypt hash for your desired password, use this in cPanel Terminal:
```bash
php -r "echo password_hash('YourSecurePassword123', PASSWORD_DEFAULT);"
```

### 2c. Connect GitHub to cPanel

1. Go to **cPanel → Git™ Version Control**
2. Click **Create**
3. Toggle OFF "Clone a Repository"... actually:
   - **Clone URL**: `https://github.com/your-username/dima-website.git`
   - **Repository Path**: `/home/youraccount/repositories/dima-website`
   - **Repository Name**: `dima-website`
4. Click **Create**

### 2d. Deploy from Repository

After cloning, set up the deployment:

1. In cPanel Git, click **Manage** on your repo
2. Go to **Pull or Deploy** tab
3. Click **Deploy HEAD Commit**

**Or use `.cpanel.yml`** (see Step 3).

---

## Step 3: Create Deployment Config

Create `.cpanel.yml` in your project root — this tells cPanel what to do on each deploy:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/youraccount/public_html
    # Copy PHP files
    - /bin/cp -R api $DEPLOYPATH/
    - /bin/cp -R admin $DEPLOYPATH/
    - /bin/cp -R includes $DEPLOYPATH/
    - /bin/cp -R public $DEPLOYPATH/
    # Copy React build
    - /bin/cp dist/index.html $DEPLOYPATH/
    - /bin/cp -R dist/assets $DEPLOYPATH/
    # Copy config files
    - /bin/cp .htaccess $DEPLOYPATH/
    # Create directories if needed
    - /bin/mkdir -p $DEPLOYPATH/uploads/documents
    - /bin/mkdir -p $DEPLOYPATH/uploads/gallery
    - /bin/mkdir -p $DEPLOYPATH/uploads/quotation-forms
    - /bin/mkdir -p $DEPLOYPATH/logs
    # Set permissions
    - /bin/chmod -R 755 $DEPLOYPATH/uploads
    - /bin/chmod -R 755 $DEPLOYPATH/logs
    # Install Composer dependencies
    - cd $DEPLOYPATH && php composer.phar install --no-dev --optimize-autoloader
```

> **Important**: Replace `youraccount` with your actual cPanel username.

---

## Step 4: Create .env.production on Server

This file contains your real DB credentials and is **NOT in git**.

SSH into your server or use cPanel File Manager to create `/home/youraccount/public_html/.env.production`:

```ini
DB_HOST = "localhost"
DB_NAME = "youraccount_dima"
DB_USER = "youraccount_dimauser"
DB_PASS = "your_secure_db_password"
```

---

## Step 5: Configure Email (Forgot Password)

Edit `includes/mail-config.php` on the server (or before pushing):

```php
const MAIL_HOST     = 'smtp.gmail.com';
const MAIL_PORT     = 587;
const MAIL_USERNAME = 'your-noreply@gmail.com';    // Dedicated Gmail
const MAIL_PASSWORD = 'xxxx xxxx xxxx xxxx';       // Gmail App Password
const MAIL_FROM     = 'your-noreply@gmail.com';
const MAIL_FROM_NAME = 'DIMA Certification';
```

To get a Gmail App Password:
1. Enable 2-Step Verification on the Gmail account
2. Go to Google Account → Security → App Passwords
3. Create one for "Mail" → copy the 16-char password

---

## Step 6: Enable HTTPS

1. Go to **cPanel → SSL/TLS** or **Let's Encrypt**
2. Install free SSL certificate for `dima.my`
3. Once active, edit `.htaccess` — uncomment the HTTPS redirect lines:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Step 7: DNS Setup

Point your domain to the cPanel server:

| Type | Name | Value |
|------|------|-------|
| A    | @    | Your server IP (from cPanel) |
| A    | www  | Your server IP |
| CNAME| www  | dima.my (alternative) |

---

## Deployment Workflow (After Initial Setup)

Every time you make changes:

```bash
# 1. Build React locally
npm run build

# 2. Commit everything
git add .
git commit -m "Description of changes"
git push origin main

# 3. Deploy on cPanel
# Go to cPanel → Git Version Control → your repo → Pull or Deploy → Deploy HEAD Commit
# Or it auto-deploys if you set up the webhook
```

### Optional: Auto-Deploy Webhook

1. In cPanel Git, copy the **deploy webhook URL**
2. In GitHub → Settings → Webhooks → Add webhook
3. Paste the URL, content type: `application/json`
4. Now every `git push` auto-deploys!

---

## File Structure on Server

After deployment, `public_html/` should look like:

```
public_html/
├── .htaccess              ← Routing & security
├── .env.production        ← DB credentials (created manually)
├── index.html             ← React SPA
├── composer.phar          ← Composer installer
├── composer.json          ← PHP dependencies
├── assets/                ← React build (JS/CSS)
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── api/                   ← PHP APIs
│   ├── admin-submissions.php
│   ├── contact-create.php
│   ├── public-gallery.php
│   └── ...
├── admin/                 ← Admin dashboard
│   ├── index.php
│   ├── login.php
│   ├── settings.php
│   └── ...
├── includes/              ← PHP libraries
│   ├── config.php
│   ├── Database.php
│   ├── mail-config.php
│   └── ...
├── public/                ← PHP public pages
├── uploads/               ← User uploads (created manually, chmod 755)
│   ├── documents/
│   ├── gallery/
│   └── quotation-forms/
├── vendor/                ← Composer (installed on server)
│   └── phpmailer/
└── logs/                  ← Error logs
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check `.htaccess` is uploaded, `mod_rewrite` enabled |
| API 500 errors | Check `.env.production` DB credentials, `includes/config.php` |
| Uploads not working | `chmod 755 uploads/` and subdirectories |
| Admin login fails | Ensure `admin_users` table has `password_hash` column with bcrypt hash |
| React routes 404 | `.htaccess` SPA fallback not working — check with hosting |
| Email not sending | Verify Gmail App Password in `mail-config.php` |
| HTTPS redirect loop | Uncomment HTTPS rules only AFTER SSL is active |
| CSS/JS not loading | Ensure `dist/assets/` is deployed to `public_html/assets/` |

---

## Quick Checklist

- [ ] GitHub repo created (private)
- [ ] cPanel MySQL database + user created
- [ ] `database.sql` + `database_updates.sql` imported
- [ ] Admin user created with bcrypt password
- [ ] `.env.production` created on server
- [ ] GitHub connected to cPanel Git
- [ ] `.cpanel.yml` configured with correct path
- [ ] First deploy done
- [ ] `uploads/` directory created with correct permissions
- [ ] Composer dependencies installed (`php composer.phar install`)
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled in `.htaccess`
- [ ] DNS pointed to server
- [ ] Admin login tested at `dima.my/admin/`
- [ ] React site working at `dima.my`
- [ ] API calls working (submit contact form, etc.)
- [ ] Mail config set up for password resets
