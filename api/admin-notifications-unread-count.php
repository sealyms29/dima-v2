<?php
/**
 * GET /api/admin-notifications-unread-count.php
 * 
 * Returns { count: N } of unread notifications.
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (empty($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

try {
    $row = Database::fetchOne("SELECT COUNT(*) as cnt FROM notifications WHERE read_at IS NULL");
    $count = (int)($row['cnt'] ?? 0);
    APIResponse::send(APIResponse::success(['count' => $count]));
} catch (Exception $e) {
    error_log('Notification count error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to fetch count', 500));
}
