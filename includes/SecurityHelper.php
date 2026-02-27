<?php
/**
 * Security Utilities
 * CSRF Protection, Input Validation, Output Escaping
 */

class SecurityHelper {
    
    /**
     * Generate CSRF Token
     */
    public static function generateCSRFToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            $_SESSION['csrf_token_time'] = time();
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Get CSRF Token from session
     */
    public static function getCSRFToken() {
        return $_SESSION['csrf_token'] ?? null;
    }

    /**
     * Verify CSRF Token
     */
    public static function verifyCSRFToken($token) {
        if (empty($_SESSION['csrf_token'])) {
            return false;
        }

        // Check token matches
        if (!hash_equals($_SESSION['csrf_token'], $token)) {
            return false;
        }

        // Check token expiry (1 hour)
        if ((time() - $_SESSION['csrf_token_time']) > CSRF_TOKEN_LIFETIME) {
            return false;
        }

        return true;
    }

    /**
     * Sanitize string input
     */
    public static function sanitizeString($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitizeString'], $input);
        }
        
        return trim(stripslashes($input));
    }

    /**
     * Validate email
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate phone number (basic - allows common formats)
     */
    public static function validatePhone($phone) {
        // Remove common formatting characters
        $clean = preg_replace('/[^0-9+\-\s()]/', '', $phone);
        // Check if it has at least 7 digits
        $digits = preg_replace('/[^0-9]/', '', $clean);
        return strlen($digits) >= 7 && strlen($digits) <= 15;
    }

    /**
     * Validate URL
     */
    public static function validateURL($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Escape HTML output (XSS prevention)
     */
    public static function escapeHTML($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    /**
     * Escape for JSON output
     */
    public static function escapeJSON($data) {
        return json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Hash password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Verify password
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Generate random token
     */
    public static function generateToken($length = 32) {
        return bin2hex(random_bytes($length));
    }

    /**
     * Rate limit check (basic IP-based)
     */
    public static function checkRateLimit($identifier, $limit = 100, $window = 3600) {
        $cache_key = 'ratelimit_' . md5($identifier);
        $cache_file = sys_get_temp_dir() . '/' . $cache_key;

        $current_count = 0;
        $current_time = time();

        if (file_exists($cache_file)) {
            $data = json_decode(file_get_contents($cache_file), true);
            
            // Check if window has expired
            if (($current_time - $data['window_start']) < $window) {
                $current_count = $data['count'];
            }
        }

        if ($current_count >= $limit) {
            return false;
        }

        // Increment counter
        file_put_contents($cache_file, json_encode([
            'count' => $current_count + 1,
            'window_start' => ($current_count === 0) ? $current_time : ($data['window_start'] ?? $current_time)
        ]));

        return true;
    }

    /**
     * Get client IP address
     */
    public static function getClientIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        }
        
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
    }

    /**
     * Validate file upload
     */
    public static function validateFileUpload($file_array) {
        $errors = [];

        if ($file_array['error'] !== UPLOAD_ERR_OK) {
            $errors[] = 'File upload failed with error code: ' . $file_array['error'];
        }

        if ($file_array['size'] > UPLOAD_MAX_SIZE) {
            $errors[] = 'File size exceeds maximum allowed: ' . format_bytes(UPLOAD_MAX_SIZE);
        }

        $mime_type = mime_content_type($file_array['tmp_name']);
        if (!in_array($mime_type, UPLOAD_ALLOWED_TYPES)) {
            $errors[] = 'File type not allowed: ' . $mime_type;
        }

        return $errors;
    }

    /**
     * Generate safe filename
     */
    public static function generateSafeFilename($original_filename) {
        $info = pathinfo($original_filename);
        $extension = strtolower($info['extension']);

        if (!in_array($extension, UPLOAD_ALLOWED_EXTENSIONS)) {
            return false;
        }

        // Create filename with timestamp and random string
        $safe_name = date('YmdHis') . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        return $safe_name;
    }
}

/**
 * Format bytes to human readable format
 */
function format_bytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= (1 << (10 * $pow));
    return round($bytes, $precision) . ' ' . $units[$pow];
}
