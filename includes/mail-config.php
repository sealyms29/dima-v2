<?php
/**
 * Mail Configuration
 * Configure SMTP settings for sending emails (password resets, etc.)
 * 
 * For Gmail SMTP:
 *   1. Enable 2-Step Verification on your Google account
 *   2. Generate an App Password: Google Account → Security → App passwords
 *   3. Use that App Password below (not your actual Gmail password)
 */

// SMTP Settings
const MAIL_HOST     = 'smtp.gmail.com';       // SMTP server
const MAIL_PORT     = 587;                     // TLS port (use 465 for SSL)
const MAIL_USERNAME = '';                       // Your Gmail address (e.g., dimacertification@gmail.com)
const MAIL_PASSWORD = '';                       // Gmail App Password (16 chars, no spaces)
const MAIL_FROM     = '';                       // From email (same as username for Gmail)
const MAIL_FROM_NAME = 'DIMA Certification';    // Sender display name

// App URL for reset links (no trailing slash)
// Auto-detect from config.php if available
if (defined('APP_URL')) {
    define('APP_BASE_URL', APP_URL);
} else {
    define('APP_BASE_URL', 'http://localhost/DIMA');
}

// Password reset token expiry (in minutes)
const RESET_TOKEN_EXPIRY = 60; // 1 hour
