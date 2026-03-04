<?php
/**
 * DIMA Configuration File
 * Store database credentials and settings
 * 
 * On cPanel: Create this file with your actual DB credentials
 * Do NOT commit real credentials to version control
 */

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

// Auto-detect environment: 'production' on cPanel, 'local' on XAMPP
if (file_exists(__DIR__ . '/../.env.production')) {
    define('APP_ENV', 'production');
} else {
    define('APP_ENV', 'local');
}

// Base path: '/DIMA' for XAMPP local, '' for production (domain root)
define('BASE_PATH', APP_ENV === 'local' ? '/DIMA' : '');

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

if (APP_ENV === 'production') {
    // Production - cPanel MySQL
    // Create .env.production with your actual cPanel DB credentials
    $envFile = __DIR__ . '/../.env.production';
    $env = parse_ini_file($envFile);
    define('DB_HOST', $env['DB_HOST'] ?? 'localhost');
    define('DB_NAME', $env['DB_NAME'] ?? '');
    define('DB_USER', $env['DB_USER'] ?? '');
    define('DB_PASS', $env['DB_PASS'] ?? '');
} else {
    // Local XAMPP development
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'dima_production');
    define('DB_USER', 'root');
    define('DB_PASS', '');
}

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

const APP_NAME = 'DIMA Certification';
define('APP_URL', APP_ENV === 'production' ? 'https://dima.my' : 'http://localhost/DIMA');
define('ADMIN_URL', APP_URL . '/admin');

// Timezone
date_default_timezone_set('Asia/Kuala_Lumpur');

// ============================================================================
// SECURITY SETTINGS
// ============================================================================

// CSRF Token expiry (1 hour)
const CSRF_TOKEN_LIFETIME = 3600;

// Session settings
const SESSION_LIFETIME = 3600; // 1 hour
const SESSION_SECURE = APP_ENV === 'production';  // true for HTTPS in production
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
