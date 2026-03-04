<?php
/**
 * POST /api/admin-notifications-read-all.php
 * 
 * Mark ALL unread notifications as read.
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (empty($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

try {
    Database::query("UPDATE notifications SET read_at = NOW() WHERE read_at IS NULL");
    APIResponse::send(APIResponse::success(null, 'All notifications marked as read'));
} catch (Exception $e) {
    error_log('Notification read-all error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to update notifications', 500));
}
