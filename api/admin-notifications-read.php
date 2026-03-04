<?php
/**
 * POST /api/admin-notifications-read.php
 * 
 * Mark a single notification as read.
 * Expects JSON body: { "id": 123 }
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (empty($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

$input = json_decode(file_get_contents('php://input'), true);
$id = intval($input['id'] ?? 0);

if ($id <= 0) {
    APIResponse::send(APIResponse::error('Invalid notification ID', 400));
}

try {
    Database::query(
        "UPDATE notifications SET read_at = NOW() WHERE id = ? AND read_at IS NULL",
        [$id]
    );
    APIResponse::send(APIResponse::success(null, 'Notification marked as read'));
} catch (Exception $e) {
    error_log('Notification read error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to update notification', 500));
}
