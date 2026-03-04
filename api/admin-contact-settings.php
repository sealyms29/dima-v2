<?php
/**
 * Admin API - Manage Contact Settings
 * GET: Fetch all contact settings
 * POST: Update contact settings
 */
require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (!isset($_SESSION['admin_user_id'])) {
    echo json_encode(APIResponse::error('Unauthorized', 401));
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// ─── GET: Fetch all contact settings ─────────────────────────
if ($method === 'GET') {
    try {
        $rows = Database::fetchAll(
            "SELECT id, setting_key, setting_value, label FROM site_settings WHERE setting_group = 'contact' ORDER BY id ASC"
        );
        echo json_encode(APIResponse::success($rows));
    } catch (Exception $e) {
        error_log('Admin contact settings fetch error: ' . $e->getMessage());
        echo json_encode(APIResponse::error('Failed to load settings', 500));
    }
    exit;
}

// ─── POST: Update contact settings ───────────────────────────
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['settings']) || !is_array($input['settings'])) {
        echo json_encode(APIResponse::error('Invalid input. Expected { settings: { key: value, ... } }'));
        exit;
    }

    try {
        DBTransaction::begin();

        $allowed_keys = [
            'office_name', 'office_address',
            'phone_1', 'phone_2',
            'email_1', 'email_2',
            'business_hours',
            'map_lat', 'map_lng'
        ];

        foreach ($input['settings'] as $key => $value) {
            if (!in_array($key, $allowed_keys)) continue;

            $sanitized = SecurityHelper::sanitizeString($value);
            Database::query(
                "UPDATE site_settings SET setting_value = ? WHERE setting_key = ? AND setting_group = 'contact'",
                [$sanitized, $key]
            );
        }

        DBTransaction::commit();

        // Log activity
        try {
            Database::insert('admin_logs', [
                'user_id'    => $_SESSION['admin_user_id'],
                'action'     => 'update_contact_settings',
                'table_name' => 'site_settings',
                'record_id'  => 'contact',
                'ip_address' => SecurityHelper::getClientIP()
            ]);
        } catch (Exception $e) {
            error_log('Activity log error: ' . $e->getMessage());
        }

        echo json_encode(APIResponse::success(null, 'Contact settings updated successfully'));
    } catch (Exception $e) {
        DBTransaction::rollback();
        error_log('Admin contact settings update error: ' . $e->getMessage());
        echo json_encode(APIResponse::error('Failed to update settings', 500));
    }
    exit;
}

echo json_encode(APIResponse::error('Method not allowed', 405));
