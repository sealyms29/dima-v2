<?php
/**
 * Bootstrap file - Include all necessary files
 * Use this at the top of each PHP file
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Prevent direct output
header('Content-Type: application/json; charset=utf-8');

// Include configuration
require_once __DIR__ . '/config.php';

// Include database class
require_once __DIR__ . '/Database.php';

// Include security helpers
require_once __DIR__ . '/SecurityHelper.php';

// Start session (for admin pages)
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'secure' => SESSION_SECURE,
        'httponly' => SESSION_HTTPONLY,
        'samesite' => 'Strict'
    ]);
    session_start();
}

// Ensure logs directory exists
if (!is_dir(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

/**
 * JSON Response Helper
 */
class APIResponse {
    public static function success($data = null, $message = 'Success', $code = 200) {
        http_response_code($code);
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function error($message = 'Error', $code = 400, $data = null) {
        http_response_code($code);
        return [
            'success' => false,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function validation($errors = []) {
        http_response_code(422);
        return [
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ];
    }

    public static function send($response) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/**
 * Database Transaction Helper
 */
class DBTransaction {
    private static $in_transaction = false;

    public static function begin() {
        if (!self::$in_transaction) {
            Database::beginTransaction();
            self::$in_transaction = true;
        }
    }

    public static function commit() {
        if (self::$in_transaction) {
            Database::commit();
            self::$in_transaction = false;
        }
    }

    public static function rollback() {
        if (self::$in_transaction) {
            Database::rollback();
            self::$in_transaction = false;
        }
    }

    public static function isActive() {
        return self::$in_transaction;
    }
}
/**
 * Log Activity Helper
 * Records admin actions to activity log
 */
function log_activity($action, $table_name, $record_id, $old_value = null, $new_value = null) {
    try {
        Database::insert('admin_logs', [
            'user_id' => $_SESSION['admin_user_id'] ?? null,
            'action' => $action,
            'table_name' => $table_name,
            'record_id' => intval($record_id),
            'old_value' => $old_value,
            'new_value' => $new_value,
            'ip_address' => SecurityHelper::getClientIP()
        ]);
    } catch (Exception $e) {
        error_log('Failed to log activity: ' . $e->getMessage());
    }
}

/**
 * Get Admin Email from Site Settings
 * Returns the primary admin email (email_1) for receiving notifications
 */
function get_admin_email(): ?string {
    try {
        $result = Database::fetchOne(
            "SELECT setting_value FROM site_settings WHERE setting_key = 'email_1' AND setting_group = 'contact'"
        );
        return $result['setting_value'] ?? null;
    } catch (Exception $e) {
        error_log('Failed to get admin email: ' . $e->getMessage());
        return null;
    }
}

/**
 * Get All Admin Emails from Site Settings
 * Returns array of admin emails (email_1 and email_2 if set)
 */
function get_admin_emails(): array {
    $emails = [];
    try {
        $results = Database::fetchAll(
            "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('email_1', 'email_2') AND setting_group = 'contact'"
        );
        foreach ($results as $row) {
            if (!empty($row['setting_value'])) {
                $emails[] = $row['setting_value'];
            }
        }
    } catch (Exception $e) {
        error_log('Failed to get admin emails: ' . $e->getMessage());
    }
    return $emails;
}