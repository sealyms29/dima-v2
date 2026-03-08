<?php
/**
 * Mail Configuration TEMPLATE
 * 
 * SETUP INSTRUCTIONS:
 *   1. Copy this file to 'mail-config.php'
 *   2. Fill in your SMTP credentials below
 *   3. Do NOT commit mail-config.php (it contains secrets)
 * 
 * For Gmail SMTP:
 *   1. Go to: myaccount.google.com → Security
 *   2. Enable "2-Step Verification"
 *   3. Generate an App Password: 
 *      - Go to myaccount.google.com/apppasswords
 *      - Select "Mail" and your device
 *      - Generate and copy the 16-character password
 *   4. Enter your Gmail address and App Password below
 * 
 * Email Functionality:
 *   - Password reset emails are sent to the user's registered email
 *   - Form submission notifications are sent to the admin email configured in Site Settings
 *     (Admin Panel → Contact Info → Email field)
 */

// ============================================================================
// SMTP Settings - Fill in your email credentials below
// ============================================================================

const MAIL_HOST     = 'smtp.gmail.com';        // SMTP server (Gmail by default)
const MAIL_PORT     = 587;                      // TLS port (use 465 for SSL)
const MAIL_USERNAME = '';                       // YOUR Gmail address (e.g., dimacertification@gmail.com)
const MAIL_PASSWORD = '';                       // YOUR Gmail App Password (16 chars, no spaces)
const MAIL_FROM     = '';                       // From email (same as MAIL_USERNAME for Gmail)
const MAIL_FROM_NAME = 'DIMA Certification';    // Sender display name

// ============================================================================
// Application Settings
// ============================================================================

// App URL for reset links (no trailing slash)
// Auto-detect from config.php if available
if (defined('APP_URL')) {
    define('APP_BASE_URL', APP_URL);
} else {
    define('APP_BASE_URL', 'http://localhost/DIMA');
}

// Password reset token expiry (in minutes)
const RESET_TOKEN_EXPIRY = 60; // 1 hour
