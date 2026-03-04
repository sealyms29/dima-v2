<?php
/**
 * Admin - Downloadable Form Edit/Create
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
$form = [
    'id' => 0,
    'form_name' => '',
    'form_type' => 'Application Form',
    'programme' => 'MSPO',
    'file_path' => '',
    'version_label' => '',
    'status' => 'active'
];

$id = intval($_GET['id'] ?? 0);

// Fetch existing form
if ($id > 0) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM downloadable_forms WHERE id = ?');
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            $form = $existing;
        } else {
            $message = 'Form not found';
            $message_type = 'error';
        }
    } catch (Exception $e) {
        $message = 'Error fetching form: ' . $e->getMessage();
        $message_type = 'error';
    }
}

$programmes = ['MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General'];
$form_types = ['Application Form', 'Questionnaire', 'Other'];

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = SecurityHelper::sanitizeString($_POST['action'] ?? 'save');
    
    if ($action === 'delete' && $id > 0) {
        try {
            $stmt = $pdo->prepare('DELETE FROM downloadable_forms WHERE id = ?');
            $stmt->execute([$id]);
            header('Location: ' . BASE_PATH . '/admin/downloadable_forms.php?message=deleted');
            exit;
        } catch (Exception $e) {
            $message = 'Error deleting form: ' . $e->getMessage();
            $message_type = 'error';
        }
    } elseif ($action === 'save') {
        $form_name = SecurityHelper::sanitizeString($_POST['form_name'] ?? '');
        $form_type = SecurityHelper::sanitizeString($_POST['form_type'] ?? 'Application Form');
        $programme = SecurityHelper::sanitizeString($_POST['programme'] ?? 'MSPO');
        $file_path = SecurityHelper::sanitizeString($_POST['file_path'] ?? '');
        $version_label = SecurityHelper::sanitizeString($_POST['version_label'] ?? '');
        $status = SecurityHelper::sanitizeString($_POST['status'] ?? 'active');

        // Validation
        $errors = [];
        if (empty($form_name)) $errors[] = 'Form name is required';
        if (empty($file_path)) $errors[] = 'File path is required';
        if (!in_array($form_type, $form_types)) $errors[] = 'Invalid form type';
        if (!in_array($programme, $programmes)) $errors[] = 'Invalid programme';
        if (!in_array($status, ['active', 'inactive'])) $errors[] = 'Invalid status';

        if (empty($errors)) {
            try {
                if ($id > 0) {
                    // Update existing
                    $stmt = $pdo->prepare('
                        UPDATE downloadable_forms 
                        SET form_name = ?, form_type = ?, programme = ?, file_path = ?, version_label = ?, status = ?
                        WHERE id = ?
                    ');
                    $stmt->execute([$form_name, $form_type, $programme, $file_path, $version_label, $status, $id]);
                    $message = 'Form updated successfully';
                } else {
                    // Create new
                    $stmt = $pdo->prepare('
                        INSERT INTO downloadable_forms 
                        (form_name, form_type, programme, file_path, version_label, status, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
                    ');
                    $stmt->execute([$form_name, $form_type, $programme, $file_path, $version_label, $status]);
                    $new_id = $pdo->lastInsertId();
                    $message = 'Form created successfully';
                    header('Location: ' . BASE_PATH . '/admin/downloadable_form_edit.php?id=' . $new_id . '&message=created');
                    exit;
                }
                $message_type = 'success';
                // Refresh data
                $form = [
                    'id' => $id,
                    'form_name' => $form_name,
                    'form_type' => $form_type,
                    'programme' => $programme,
                    'file_path' => $file_path,
                    'version_label' => $version_label,
                    'status' => $status
                ];
            } catch (Exception $e) {
                $message = 'Error saving form: ' . $e->getMessage();
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
    <title><?php echo $id > 0 ? 'Edit' : 'Create'; ?> Downloadable Form - Admin</title>
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

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-row-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
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

        .form-hint {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><?php echo $id > 0 ? 'Edit' : 'Create'; ?> Downloadable Form</h1>
            <div style="display: flex; gap: 12px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
                <span style="color: #666; font-size: 14px; margin-right: 20px;">Logged in as: Admin</span>
                <a href="<?= BASE_PATH ?>/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <div class="breadcrumb">
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a> / 
            <a href="<?= BASE_PATH ?>/admin/downloadable_forms.php">Downloadable Forms</a> / 
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
                    <label for="form_name">Form Name <span class="required">*</span></label>
                    <input type="text" id="form_name" name="form_name" required value="<?php echo htmlspecialchars($form['form_name']); ?>" placeholder="e.g., MSPO Application Form 2024">
                </div>

                <div class="form-row-3">
                    <div class="form-group">
                        <label for="form_type">Form Type <span class="required">*</span></label>
                        <select id="form_type" name="form_type" required>
                            <?php foreach ($form_types as $type): ?>
                                <option value="<?php echo $type; ?>" <?php echo $form['form_type'] === $type ? 'selected' : ''; ?>>
                                    <?php echo $type; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="programme">Programme <span class="required">*</span></label>
                        <select id="programme" name="programme" required>
                            <?php foreach ($programmes as $prog): ?>
                                <option value="<?php echo $prog; ?>" <?php echo $form['programme'] === $prog ? 'selected' : ''; ?>>
                                    <?php echo $prog; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">Status <span class="required">*</span></label>
                        <select id="status" name="status" required>
                            <option value="active" <?php echo $form['status'] === 'active' ? 'selected' : ''; ?>>Active</option>
                            <option value="inactive" <?php echo $form['status'] === 'inactive' ? 'selected' : ''; ?>>Inactive</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="file_path">File Path <span class="required">*</span></label>
                        <input type="text" id="file_path" name="file_path" required value="<?php echo htmlspecialchars($form['file_path']); ?>" placeholder="/assets/forms/mspo-application-2024.pdf">
                        <div class="form-hint">Path to the PDF file relative to website root</div>
                    </div>
                    <div class="form-group">
                        <label for="version_label">Version Label</label>
                        <input type="text" id="version_label" name="version_label" value="<?php echo htmlspecialchars($form['version_label']); ?>" placeholder="e.g., v1.0, 2024-01">
                        <div class="form-hint">Optional version identifier</div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" name="action" value="save" class="btn btn-primary">Save Form</button>
                    <a href="<?= BASE_PATH ?>/admin/downloadable_forms.php" class="btn btn-secondary">Cancel</a>
                    <?php if ($id > 0): ?>
                        <button type="submit" name="action" value="delete" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this form?');">Delete</button>
                    <?php endif; ?>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
