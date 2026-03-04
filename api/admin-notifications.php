<?php
/**
 * GET /api/admin-notifications.php
 * 
 * List notifications for admin.
 * Query params:
 *   unreadOnly = true|false (default false)
 *   limit      = 1-50       (default 10)
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (empty($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

$unreadOnly = filter_input(INPUT_GET, 'unreadOnly', FILTER_VALIDATE_BOOLEAN) ?? false;
$limit = max(1, min(50, intval($_GET['limit'] ?? 10)));

try {
    $where = $unreadOnly ? 'WHERE read_at IS NULL' : '';
    $sql = "SELECT * FROM notifications $where ORDER BY created_at DESC LIMIT $limit";
    $rows = Database::fetchAll($sql);

    // Format dates for frontend
    $items = [];
    foreach ($rows as $row) {
        $items[] = [
            'id'            => (int)$row['id'],
            'type'          => $row['type'],
            'submission_id' => $row['submission_id'] ? (int)$row['submission_id'] : null,
            'name'          => $row['name'],
            'email'         => $row['email'],
            'message'       => $row['message'],
            'read_at'       => $row['read_at'],
            'created_at'    => $row['created_at'],
        ];
    }

    APIResponse::send(APIResponse::success($items));

} catch (Exception $e) {
    error_log('Notifications list error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to fetch notifications', 500));
}
