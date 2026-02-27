<?php
/**
 * DIMA Configuration File
 * Store database credentials and settings
 * 
 * On cPanel: Create this file with your actual DB credentials
 * Do NOT commit real credentials to version control
 */

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

// For localhost/XAMPP development
const DB_HOST = 'localhost';
const DB_NAME = 'dima_db';
const DB_USER = 'dima_user';
const DB_PASS = 'your_secure_password_here';

// For production on cPanel, use environment variables or:
// const DB_HOST = 'localhost';
// const DB_NAME = 'cpanel_username_dbname';
// const DB_USER = 'cpanel_username_user';
// const DB_PASS = getenv('DB_PASSWORD'); // Set from cPanel environment

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

const APP_NAME = 'DIMA Certification';
const APP_URL = 'https://yourdomain.com';
const ADMIN_URL = APP_URL . '/admin';

// Timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

// ============================================================================
// SECURITY SETTINGS
// ============================================================================

// CSRF Token expiry (1 hour)
const CSRF_TOKEN_LIFETIME = 3600;

// Session settings
const SESSION_LIFETIME = 3600; // 1 hour
const SESSION_SECURE = true;   // Only send over HTTPS
const SESSION_HTTPONLY = true; // Not accessible via JavaScript

// File upload settings
const UPLOAD_MAX_SIZE = 5242880; // 5MB
const UPLOAD_ALLOWED_TYPES = ['application/pdf'];
const UPLOAD_ALLOWED_EXTENSIONS = ['pdf'];

// ============================================================================
// EMAIL SETTINGS (Optional - for notifications)
// ============================================================================

const SEND_EMAIL_NOTIFICATIONS = false;
const NOTIFICATION_EMAIL = 'info@dima.com.my';
const SMTP_HOST = 'mail.yourdomain.com';
const SMTP_PORT = 587;
const SMTP_USER = 'noreply@yourdomain.com';
const SMTP_PASS = 'your_email_password';

// ============================================================================
// API SETTINGS
// ============================================================================

const API_RATE_LIMIT = 100;           // Requests per hour per IP
const API_TIMEOUT = 30;               // Request timeout in seconds
const RESPONSE_JSON_PRETTY = false;   // Pretty-print JSON in production

// ============================================================================
// LOGGING
// ============================================================================

const LOG_QUERIES = false;             // Log SQL queries (disable in production)
const LOG_DIR = __DIR__ . '/../logs';

// Make sure logs directory exists
if (!is_dir(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current timezone
 */
function get_timezone() {
    return 'Asia/Kuala_Lumpur';
}

/**
 * Get current datetime in Malaysia timezone
 */
function get_current_datetime() {
    return new DateTime('now', new DateTimeZone(get_timezone()));
}

/**
 * Format datetime for display
 */
function format_datetime($datetime_string, $format = 'Y-m-d H:i:s') {
    try {
        $dt = new DateTime($datetime_string, new DateTimeZone('UTC'));
        $dt->setTimezone(new DateTimeZone(get_timezone()));
        return $dt->format($format);
    } catch (Exception $e) {
        return $datetime_string;
    }
}
