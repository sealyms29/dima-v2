<?php
/**
 * Admin - MSPO Public Summary Report Edit/Create
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
$report = [
    'id' => 0,
    'report_title' => '',
    'summary_text' => '',
    'year' => date('Y'),
    'status' => 'draft'
];

$id = intval($_GET['id'] ?? 0);

// Fetch existing report
if ($id > 0) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM mspo_public_summary_reports WHERE id = ?');
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            $report = $existing;
        } else {
            $message = 'Report not found';
            $message_type = 'error';
        }
    } catch (Exception $e) {
        $message = 'Error fetching report: ' . $e->getMessage();
        $message_type = 'error';
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = SecurityHelper::sanitizeString($_POST['action'] ?? 'save');
    
    if ($action === 'delete' && $id > 0) {
        try {
            $stmt = $pdo->prepare('DELETE FROM mspo_public_summary_reports WHERE id = ?');
            $stmt->execute([$id]);
            header('Location: ' . BASE_PATH . '/admin/mspo_reports.php?message=deleted');
            exit;
        } catch (Exception $e) {
            $message = 'Error deleting report: ' . $e->getMessage();
            $message_type = 'error';
        }
    } elseif ($action === 'save') {
        $title = SecurityHelper::sanitizeString($_POST['report_title'] ?? '');
        $summary = SecurityHelper::sanitizeString($_POST['summary_text'] ?? '');
        $year = intval($_POST['year'] ?? date('Y'));
        $status = SecurityHelper::sanitizeString($_POST['status'] ?? 'draft');

        // Validation
        $errors = [];
        if (empty($title)) $errors[] = 'Report title is required';
        if (empty($summary)) $errors[] = 'Summary text is required';
        if (!in_array($status, ['draft', 'published', 'archived'])) $errors[] = 'Invalid status';

        if (empty($errors)) {
            try {
                $published_at = null;
                if ($status === 'published') {
                    $published_at = date('Y-m-d H:i:s');
                }

                if ($id > 0) {
                    // Update existing
                    $stmt = $pdo->prepare('
                        UPDATE mspo_public_summary_reports 
                        SET report_title = ?, summary_text = ?, year = ?, status = ?, published_at = ?
                        WHERE id = ?
                    ');
                    $stmt->execute([$title, $summary, $year, $status, $published_at, $id]);
                    $message = 'Report updated successfully';
                } else {
                    // Create new
                    $stmt = $pdo->prepare('
                        INSERT INTO mspo_public_summary_reports 
                        (report_title, summary_text, year, status, published_at, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                    ');
                    $stmt->execute([$title, $summary, $year, $status, $published_at]);
                    $new_id = $pdo->lastInsertId();
                    $message = 'Report created successfully';
                    header('Location: ' . BASE_PATH . '/admin/mspo_report_edit.php?id=' . $new_id . '&message=created');
                    exit;
                }
                $message_type = 'success';
                // Refresh data
                $report = [
                    'id' => $id,
                    'report_title' => $title,
                    'summary_text' => $summary,
                    'year' => $year,
                    'status' => $status
                ];
            } catch (Exception $e) {
                $message = 'Error saving report: ' . $e->getMessage();
                $message_type = 'error';
            }
        } else {
            $message = 'Validation errors: ' . implode(', ', $errors);
            $message_type = 'error';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $id > 0 ? 'Edit' : 'Create'; ?> MSPO Report - Admin</title>
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
            max-width: 900px;
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

        .breadcrumb {
            background: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 14px;
        }

        .breadcrumb a {
            color: #007bff;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
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

        .form-container {
            background: white;
            padding: 30px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        textarea {
            resize: vertical;
            min-height: 200px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }

        button, .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: #007bff;
            color: white;
        }

        .btn-primary:hover {
            background: #0056b3;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
            margin-left: auto;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .required {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><?php echo $id > 0 ? 'Edit' : 'Create'; ?> MSPO Report</h1>
            <div>
                <span style="color: #666; font-size: 14px; margin-right: 20px;">Logged in as: Admin</span>
                <a href="<?= BASE_PATH ?>/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <div class="breadcrumb">
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a> / 
            <a href="<?= BASE_PATH ?>/admin/mspo_reports.php">MSPO Reports</a> / 
            <span><?php echo $id > 0 ? 'Edit' : 'Create'; ?></span>
        </div>

        <?php if ($message): ?>
            <div class="message <?php echo $message_type; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="form-container">
            <form method="POST">
                <div class="form-group">
                    <label for="report_title">Report Title <span class="required">*</span></label>
                    <input type="text" id="report_title" name="report_title" required value="<?php echo htmlspecialchars($report['report_title']); ?>" placeholder="e.g., 2024 Annual Summary Report">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="year">Year</label>
                        <input type="number" id="year" name="year" value="<?php echo htmlspecialchars($report['year']); ?>" placeholder="e.g., 2024">
                    </div>
                    <div class="form-group">
                        <label for="status">Status <span class="required">*</span></label>
                        <select id="status" name="status" required>
                            <option value="draft" <?php echo $report['status'] === 'draft' ? 'selected' : ''; ?>>Draft</option>
                            <option value="published" <?php echo $report['status'] === 'published' ? 'selected' : ''; ?>>Published</option>
                            <option value="archived" <?php echo $report['status'] === 'archived' ? 'selected' : ''; ?>>Archived</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="summary_text">Summary Text <span class="required">*</span></label>
                    <textarea id="summary_text" name="summary_text" required placeholder="Enter report summary or content..."><?php echo htmlspecialchars($report['summary_text']); ?></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" name="action" value="save" class="btn btn-primary">Save Report</button>
                    <a href="<?= BASE_PATH ?>/admin/mspo_reports.php" class="btn btn-secondary">Cancel</a>
                    <?php if ($id > 0): ?>
                        <button type="submit" name="action" value="delete" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this report?');">Delete</button>
                    <?php endif; ?>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
