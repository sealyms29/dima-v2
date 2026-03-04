<?php
/**
 * Admin - Downloadable Forms Management
 */

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../includes/SecurityHelper.php';

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'secure' => SESSION_SECURE,
        'httponly' => SESSION_HTTPONLY,
        'samesite' => 'Strict'
    ]);
    session_start();
}

if (!isset($_SESSION['admin_user_id'])) {
    header('Location: ' . BASE_PATH . '/admin/login.php');
    exit;
}

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER,
    DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$message = '';
$message_type = '';

// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    if ($id > 0) {
        try {
            $stmt = $pdo->prepare('DELETE FROM downloadable_forms WHERE id = ?');
            $stmt->execute([$id]);
            $message = 'Form deleted successfully';
            $message_type = 'success';
        } catch (Exception $e) {
            $message = 'Error deleting form: ' . $e->getMessage();
            $message_type = 'error';
        }
    }
}

// Get search and filter parameters
$search = SecurityHelper::sanitizeString($_GET['search'] ?? '');
$programme_filter = SecurityHelper::sanitizeString($_GET['programme'] ?? '');
$type_filter = SecurityHelper::sanitizeString($_GET['type'] ?? '');
$status_filter = SecurityHelper::sanitizeString($_GET['status'] ?? '');

// Build query
$where_clause = '1=1';
$params = [];

if (!empty($search)) {
    $where_clause .= ' AND form_name LIKE ?';
    $search_param = '%' . $search . '%';
    $params[] = $search_param;
}

if (!empty($programme_filter)) {
    $where_clause .= ' AND programme = ?';
    $params[] = $programme_filter;
}

if (!empty($type_filter)) {
    $where_clause .= ' AND form_type = ?';
    $params[] = $type_filter;
}

if (!empty($status_filter)) {
    $where_clause .= ' AND status = ?';
    $params[] = $status_filter;
}

// Fetch forms
try {
    $stmt = $pdo->prepare("SELECT * FROM downloadable_forms WHERE $where_clause ORDER BY programme ASC, form_name ASC");
    $stmt->execute($params);
    $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $forms = [];
    $message = 'Error fetching forms: ' . $e->getMessage();
    $message_type = 'error';
}

$programmes = ['MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General'];
$form_types = ['Application Form', 'Questionnaire', 'Other'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downloadable Forms - Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            color: #333;
        }

        .container {
            max-width: 1200px;
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

        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
        }

        .logout-btn:hover {
            background: #c82333;
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

        nav a:hover, nav a.active {
            background: #007bff;
            color: white;
        }

        .message {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .controls {
            background: white;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: flex-end;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        label {
            font-weight: 600;
            font-size: 13px;
            color: #555;
        }

        input[type="text"], select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        button {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }

        button:hover {
            background: #0056b3;
        }

        .btn-add {
            background: #28a745;
            margin-left: auto;
        }

        .btn-add:hover {
            background: #218838;
        }

        .table-container {
            background: white;
            border-radius: 4px;
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

        .badge-active {
            background: #d4edda;
            color: #155724;
        }

        .badge-inactive {
            background: #f0f0f0;
            color: #666;
        }

        .badge-mspo {
            background: #e3f2fd;
            color: #0d47a1;
        }

        .badge-iso {
            background: #f3e5f5;
            color: #4a148c;
        }

        .badge-general {
            background: #fff3e0;
            color: #e65100;
        }

        .actions {
            display: flex;
            gap: 8px;
        }

        .btn-edit {
            background: #007bff;
            color: white;
            padding: 6px 12px;
            text-decoration: none;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            border: none;
        }

        .btn-edit:hover {
            background: #0056b3;
        }

        .btn-delete {
            background: #dc3545;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
        }

        .btn-delete:hover {
            background: #c82333;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Downloadable Forms</h1>
            <div>
                <span style="color: #666; font-size: 14px; margin-right: 20px;">Logged in as: Admin</span>
                <a href="<?= BASE_PATH ?>/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/mspo_notifications.php">MSPO Notifications</a>
            <a href="<?= BASE_PATH ?>/admin/mspo_reports.php">MSPO Reports</a>
            <a href="<?= BASE_PATH ?>/admin/downloadable_forms.php" class="active">Downloadable Forms</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
        </nav>

        <?php if ($message): ?>
            <div class="message <?php echo $message_type; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="controls">
            <form method="GET" style="display: flex; gap: 10px; flex: 1; align-items: flex-end; flex-wrap: wrap;">
                <div class="control-group">
                    <label for="search">Search:</label>
                    <input type="text" id="search" name="search" placeholder="Form name..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
                <div class="control-group">
                    <label for="programme">Programme:</label>
                    <select id="programme" name="programme">
                        <option value="">All</option>
                        <?php foreach ($programmes as $prog): ?>
                            <option value="<?php echo $prog; ?>" <?php echo $programme_filter === $prog ? 'selected' : ''; ?>>
                                <?php echo $prog; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="control-group">
                    <label for="type">Type:</label>
                    <select id="type" name="type">
                        <option value="">All</option>
                        <?php foreach ($form_types as $type): ?>
                            <option value="<?php echo $type; ?>" <?php echo $type_filter === $type ? 'selected' : ''; ?>>
                                <?php echo $type; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="control-group">
                    <label for="status">Status:</label>
                    <select id="status" name="status">
                        <option value="">All</option>
                        <option value="active" <?php echo $status_filter === 'active' ? 'selected' : ''; ?>>Active</option>
                        <option value="inactive" <?php echo $status_filter === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
                    </select>
                </div>
                <button type="submit">Filter</button>
            </form>
            <a href="<?= BASE_PATH ?>/admin/downloadable_form_edit.php" class="btn-add">+ Add New Form</a>
        </div>

        <div class="table-container">
            <?php if (!empty($forms)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Form Name</th>
                            <th>Type</th>
                            <th>Programme</th>
                            <th>Version</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($forms as $form): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($form['id']); ?></td>
                                <td><?php echo htmlspecialchars(substr($form['form_name'], 0, 40)); ?></td>
                                <td><?php echo htmlspecialchars($form['form_type']); ?></td>
                                <td>
                                    <span class="badge <?php echo strpos($form['programme'], 'ISO') === 0 ? 'badge-iso' : (strpos($form['programme'], 'MSPO') === 0 ? 'badge-mspo' : 'badge-general'); ?>">
                                        <?php echo htmlspecialchars($form['programme']); ?>
                                    </span>
                                </td>
                                <td><?php echo $form['version_label'] ? htmlspecialchars($form['version_label']) : '—'; ?></td>
                                <td>
                                    <span class="badge badge-<?php echo $form['status']; ?>">
                                        <?php echo ucfirst($form['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <div class="actions">
                                        <a href="<?= BASE_PATH ?>/admin/downloadable_form_edit.php?id=<?php echo $form['id']; ?>" class="btn-edit">Edit</a>
                                        <form method="POST" style="display: inline;" onsubmit="return confirm('Delete this form?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $form['id']; ?>">
                                            <button type="submit" class="btn-delete">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="empty-state">
                    <p>No forms found. <a href="<?= BASE_PATH ?>/admin/downloadable_form_edit.php">Create your first form →</a></p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
