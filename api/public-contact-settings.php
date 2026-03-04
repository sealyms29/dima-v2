<?php
/**
 * Public API - Get Contact Settings
 * Returns contact info for the Contact page
 */
require_once __DIR__ . '/../includes/bootstrap.php';

// Only GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(APIResponse::error('Method not allowed', 405));
    exit;
}

try {
    $rows = Database::fetchAll(
        "SELECT setting_key, setting_value FROM site_settings WHERE setting_group = 'contact'"
    );

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    echo json_encode(APIResponse::success($settings));
} catch (Exception $e) {
    error_log('Public contact settings error: ' . $e->getMessage());
    echo json_encode(APIResponse::error('Failed to load contact settings', 500));
}
