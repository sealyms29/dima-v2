<?php
/**
 * Admin Submissions List Page
 */

header('Content-Type: text/html; charset=utf-8');

// Include config and start session
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../includes/SecurityHelper.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'secure' => SESSION_SECURE,
        'httponly' => SESSION_HTTPONLY,
        'samesite' => 'Strict'
    ]);
    session_start();
}

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    header('Location: ' . BASE_PATH . '/admin/login.php');
    exit;
}

$type = $_GET['type'] ?? 'quotation';
$status = $_GET['status'] ?? '';
$search = $_GET['q'] ?? '';
$page = intval($_GET['page'] ?? 1);
if ($page < 1) $page = 1;

// Validate type
if (!in_array($type, ['quotation', 'contact', 'complaint'])) {
    $type = 'quotation';
}

// Direct database query instead of HTTP API call
$tables = [
    'quotation' => 'quotations',
    'contact' => 'contacts',
    'complaint' => 'complaints'
];
$table = $tables[$type];
$per_page = 20;

$response_data = [];
$error_message = '';

try {
    $where_conditions = [];
    $params = [];

    if (!empty($status)) {
        $where_conditions[] = 'status = ?';
        $params[] = $status;
    }

    if (!empty($search)) {
        $where_conditions[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        $search_like = '%' . $search . '%';
        $params[] = $search_like;
        $params[] = $search_like;
        $params[] = $search_like;
    }

    $where = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

    // Get total count
    $count_result = Database::fetchOne("SELECT COUNT(*) as total FROM `$table` $where", $params);
    $total = $count_result['total'] ?? 0;
    $total_pages = max(1, ceil($total / $per_page));
    $offset = ($page - 1) * $per_page;

    // Get paginated results - use intval directly in SQL to avoid PDO LIMIT binding issues
    $limit_int = intval($per_page);
    $offset_int = intval($offset);
    $submissions_raw = Database::fetchAll("SELECT * FROM `$table` $where ORDER BY created_at DESC LIMIT $limit_int OFFSET $offset_int", $params);

    // Escape output
    foreach ($submissions_raw as &$row) {
        foreach ($row as $key => &$value) {
            if (is_string($value)) {
                $value = SecurityHelper::escapeHTML($value);
            }
        }
    }

    $response_data = [
        'submissions' => $submissions_raw,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $per_page,
            'total' => $total,
            'total_pages' => $total_pages,
            'total_records' => $total
        ]
    ];
} catch (Exception $e) {
    error_log('Submissions query error: ' . $e->getMessage());
    $error_message = 'Failed to fetch submissions';
}

$submissions = $response_data['submissions'] ?? [];
$pagination = $response_data['pagination'] ?? ['total_pages' => 1, 'current_page' => 1, 'total_records' => 0];


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submissions - Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 {
            font-size: 24px;
            color: #1a1a1a;
        }

        nav {
            background: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        nav a {
            display: inline-block;
            padding: 8px 16px;
            margin-right: 10px;
            background: #f0f0f0;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }

        nav a.active {
            background: #007bff;
            color: white;
        }

        .filters {
            background: white;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
        }

        .filter-group {
            display: flex;
            gap: 15px;
            align-items: flex-end;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .filter-item {
            display: flex;
            flex-direction: column;
        }

        label {
            font-size: 14px;
            margin-bottom: 5px;
            font-weight: 500;
        }

        select, input[type="text"] {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            min-width: 150px;
        }

        select {
            cursor: pointer;
        }

        button {
            background: #007bff;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        button:hover {
            background: #0056b3;
        }

        .export-btn {
            background: #28a745;
        }

        .export-btn:hover {
            background: #218838;
        }

        .submission-table {
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        th {
            background: #f5f5f5;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-weight: 600;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
        }

        tr:hover {
            background: #fafafa;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-new {
            background: #fff3cd;
            color: #856404;
        }

        .badge-viewed {
            background: #d1ecf1;
            color: #0c5460;
        }

        .badge-responded {
            background: #d4edda;
            color: #155724;
        }

        .badge-closed {
            background: #f8f9fa;
            color: #383d41;
        }

        .action-link {
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
        }

        .action-link:hover {
            text-decoration: underline;
        }

        .empty-message {
            text-align: center;
            padding: 30px;
            color: #999;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-top: 20px;
        }

        .pagination a, .pagination span {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-decoration: none;
            color: #007bff;
            font-size: 14px;
        }

        .pagination span.current {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }

        .pagination a:hover {
            background: #f0f0f0;
        }

        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }

        .tab-btn {
            padding: 10px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            color: #666;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
        }

        .tab-btn.active {
            color: #007bff;
            border-bottom-color: #007bff;
        }

        .tab-btn:hover {
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Submissions Management</h1>
            <div style="display: flex; gap: 20px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php" class="active">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <?php if (!empty($error_message)): ?>
            <div class="error"><?php echo SecurityHelper::escapeHTML($error_message); ?></div>
        <?php endif; ?>

        <div class="tabs">
            <button class="tab-btn <?php echo $type === 'quotation' ? 'active' : ''; ?>" 
                    onclick="window.location.href='?type=quotation'">Quotations</button>
            <button class="tab-btn <?php echo $type === 'contact' ? 'active' : ''; ?>" 
                    onclick="window.location.href='?type=contact'">Contact Requests</button>
            <button class="tab-btn <?php echo $type === 'complaint' ? 'active' : ''; ?>" 
                    onclick="window.location.href='?type=complaint'">Complaints & Appeals</button>
        </div>

        <div class="filters">
            <form method="get" id="filterForm">
                <input type="hidden" name="type" value="<?php echo htmlspecialchars($type); ?>">
                
                <div class="filter-group">
                    <div class="filter-item">
                        <label for="status">Status:</label>
                        <select name="status" id="status">
                            <option value="">All</option>
                            <?php if ($type === 'complaint'): ?>
                                <option value="new" <?php echo $status === 'new' ? 'selected' : ''; ?>>New</option>
                                <option value="under_review" <?php echo $status === 'under_review' ? 'selected' : ''; ?>>Under Review</option>
                                <option value="responded" <?php echo $status === 'responded' ? 'selected' : ''; ?>>Responded</option>
                                <option value="resolved" <?php echo $status === 'resolved' ? 'selected' : ''; ?>>Resolved</option>
                                <option value="closed" <?php echo $status === 'closed' ? 'selected' : ''; ?>>Closed</option>
                            <?php else: ?>
                                <option value="new" <?php echo $status === 'new' ? 'selected' : ''; ?>>New</option>
                                <option value="viewed" <?php echo $status === 'viewed' ? 'selected' : ''; ?>>Viewed</option>
                                <option value="responded" <?php echo $status === 'responded' ? 'selected' : ''; ?>>Responded</option>
                                <option value="closed" <?php echo $status === 'closed' ? 'selected' : ''; ?>>Closed</option>
                            <?php endif; ?>
                        </select>
                    </div>

                    <div class="filter-item">
                        <label for="search">Search:</label>
                        <input type="text" id="search" name="q" placeholder="Name, email, or phone" value="<?php echo htmlspecialchars($search); ?>">
                    </div>

                    <button type="submit">Filter</button>
                </div>
            </form>

            <a href="javascript:void(0);" onclick="exportCSV()" class="export-btn" style="display: inline-block; text-decoration: none; color: white;">
                Export to CSV
            </a>
        </div>

        <div class="submission-table">
            <?php if (!empty($submissions)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <?php if ($type === 'complaint'): ?>
                                <th>Programme</th>
                            <?php else: ?>
                                <th>Company</th>
                            <?php endif; ?>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($submissions as $row): ?>
                            <tr>
                                <td><?php echo '#' . htmlspecialchars($row['id']); ?></td>
                                <td><?php echo htmlspecialchars($row['name']); ?></td>
                                <td><?php echo htmlspecialchars($row['email']); ?></td>
                                <td><?php echo htmlspecialchars($row['phone']); ?></td>
                                <td><?php 
                                    if ($type === 'complaint') {
                                        echo strtoupper(htmlspecialchars($row['programme'] ?? ''));
                                    } else {
                                        echo htmlspecialchars($row['company'] ?? '');
                                    }
                                ?></td>
                                <td>
                                    <span class="badge badge-<?php echo strtolower($row['status']); ?>">
                                        <?php echo ucfirst(str_replace('_', ' ', $row['status'])); ?>
                                    </span>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($row['created_at'])); ?></td>
                                <td>
                                    <a href="<?= BASE_PATH ?>/admin/submission-view.php?type=<?php echo htmlspecialchars($type); ?>&id=<?php echo htmlspecialchars($row['id']); ?>" 
                                       class="action-link">View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="empty-message">
                    <p>No submissions found.</p>
                </div>
            <?php endif; ?>
        </div>

        <?php if ($pagination['total_pages'] > 1): ?>
            <div class="pagination">
                <?php if ($pagination['current_page'] > 1): ?>
                    <a href="?type=<?php echo urlencode($type); ?>&page=1<?php echo $status ? '&status=' . urlencode($status) : ''; ?><?php echo $search ? '&q=' . urlencode($search) : ''; ?>">First</a>
                    <a href="?type=<?php echo urlencode($type); ?>&page=<?php echo $pagination['current_page'] - 1; ?><?php echo $status ? '&status=' . urlencode($status) : ''; ?><?php echo $search ? '&q=' . urlencode($search) : ''; ?>">Previous</a>
                <?php endif; ?>

                <span class="current"><?php echo $pagination['current_page']; ?></span>

                <?php if ($pagination['current_page'] < $pagination['total_pages']): ?>
                    <a href="?type=<?php echo urlencode($type); ?>&page=<?php echo $pagination['current_page'] + 1; ?><?php echo $status ? '&status=' . urlencode($status) : ''; ?><?php echo $search ? '&q=' . urlencode($search) : ''; ?>">Next</a>
                    <a href="?type=<?php echo urlencode($type); ?>&page=<?php echo $pagination['total_pages']; ?><?php echo $status ? '&status=' . urlencode($status) : ''; ?><?php echo $search ? '&q=' . urlencode($search) : ''; ?>">Last</a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <script>
        function exportCSV() {
            const type = '<?php echo urlencode($type); ?>';
            const status = '<?php echo urlencode($status); ?>';
            const search = '<?php echo urlencode($search); ?>';
            
            let url = '/api/admin-export.php?type=' + type;
            if (status) url += '&status=' + status;
            if (search) url += '&q=' + search;
            
            window.location.href = url;
        }
    </script>
</body>
</html>
