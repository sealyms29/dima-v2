<?php
/**
 * Admin - MSPO Public Notification Edit/Create
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

$id = intval($_GET['id'] ?? 0);
$notification = null;
$message = '';
$message_type = '';

// Fetch existing notification if editing
if ($id > 0) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM mspo_notifications WHERE id = ?');
        $stmt->execute([$id]);
        $notification = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$notification) {
            header('Location: ' . BASE_PATH . '/admin/mspo_notifications.php');
            exit;
        }
    } catch (Exception $e) {
        $message = 'Error fetching notification: ' . $e->getMessage();
        $message_type = 'error';
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $effective_date = trim($_POST['effective_date'] ?? '');
    $status = trim($_POST['status'] ?? 'draft');
    
    $errors = [];
    
    if (empty($title)) $errors[] = 'Title is required';
    if (empty($content)) $errors[] = 'Content is required';
    if (!in_array($status, ['draft', 'published', 'archived'])) $errors[] = 'Invalid status';
    
    if (empty($errors)) {
        try {
            $published_at = null;
            if ($status === 'published') {
                $published_at = date('Y-m-d H:i:s');
            }
            
            if ($id > 0) {
                // Update
                $stmt = $pdo->prepare('
                    UPDATE mspo_notifications 
                    SET title = ?, content = ?, effective_date = ?, status = ?, published_at = ?
                    WHERE id = ?
                ');
                $stmt->execute([$title, $content, $effective_date ?: null, $status, $published_at, $id]);
                $message = 'Notification updated successfully';
            } else {
                // Create
                $stmt = $pdo->prepare('
                    INSERT INTO mspo_notifications (title, content, effective_date, status, published_at)
                    VALUES (?, ?, ?, ?, ?)
                ');
                $stmt->execute([$title, $content, $effective_date ?: null, $status, $published_at]);
                $id = $pdo->lastInsertId();
                $message = 'Notification created successfully';
            }
            $message_type = 'success';
            
            // Refresh notification data
            $stmt = $pdo->prepare('SELECT * FROM mspo_notifications WHERE id = ?');
            $stmt->execute([$id]);
            $notification = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $message = 'Error saving notification: ' . $e->getMessage();
            $message_type = 'error';
        }
    } else {
        $message = implode('; ', $errors);
        $message_type = 'error';
    }
}

$page_title = $id > 0 ? 'Edit Notification' : 'Create New Notification';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?> - Admin</title>
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
            margin-bottom: 20px;
            border-radius: 4px;
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
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        input[type="text"], 
        input[type="date"], 
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
        input[type="date"]:focus,
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

        .form-hint {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }

        .btn-save {
            background: #28a745;
            color: white;
        }

        .btn-save:hover {
            background: #218838;
        }

        .btn-cancel {
            background: #6c757d;
            color: white;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-cancel:hover {
            background: #5a6268;
        }

        .btn-delete {
            background: #dc3545;
            color: white;
            margin-left: auto;
        }

        .btn-delete:hover {
            background: #c82333;
        }

        .status-info {
            background: #e7f3ff;
            padding: 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #004085;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><?php echo $page_title; ?></h1>
            <div style="display: flex; gap: 12px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
                <a href="<?= BASE_PATH ?>/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <div class="breadcrumb">
            ← <a href="<?= BASE_PATH ?>/admin/mspo_notifications.php">Back to Notifications</a>
        </div>

        <?php if ($message): ?>
            <div class="message <?php echo $message_type; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="form-container">
            <form method="POST">
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" required 
                           value="<?php echo $notification ? htmlspecialchars($notification['title']) : ''; ?>">
                    <div class="form-hint">Brief title for the notification</div>
                </div>

                <div class="form-group">
                    <label for="content">Content *</label>
                    <textarea id="content" name="content" required><?php echo $notification ? htmlspecialchars($notification['content']) : ''; ?></textarea>
                    <div class="form-hint">Full notification content (simple text or HTML)</div>
                </div>

                <div class="form-group">
                    <label for="effective_date">Effective Date</label>
                    <input type="date" id="effective_date" name="effective_date"
                           value="<?php echo $notification && $notification['effective_date'] ? htmlspecialchars($notification['effective_date']) : ''; ?>">
                    <div class="form-hint">Optional date when this notification becomes effective</div>
                </div>

                <div class="form-group">
                    <label for="status">Status *</label>
                    <select id="status" name="status" required>
                        <option value="draft" <?php echo (!$notification || $notification['status'] === 'draft') ? 'selected' : ''; ?>>Draft</option>
                        <option value="published" <?php echo $notification && $notification['status'] === 'published' ? 'selected' : ''; ?>>Published</option>
                        <option value="archived" <?php echo $notification && $notification['status'] === 'archived' ? 'selected' : ''; ?>>Archived</option>
                    </select>
                    <div class="status-info">
                        <strong>Draft:</strong> Not visible to public<br>
                        <strong>Published:</strong> Visible on public pages<br>
                        <strong>Archived:</strong> Hidden from public
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-save">Save Notification</button>
                    <a href="<?= BASE_PATH ?>/admin/mspo_notifications.php" class="btn-cancel">Cancel</a>
                    <?php if ($id > 0): ?>
                        <button type="button" class="btn-delete" onclick="deleteNotification()">Delete</button>
                    <?php endif; ?>
                </div>
            </form>
        </div>
    </div>

    <?php if ($id > 0): ?>
    <script>
        function deleteNotification() {
            if (confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '<?= BASE_PATH ?>/admin/mspo_notifications.php';
                form.innerHTML = '<input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?php echo $id; ?>">';
                document.body.appendChild(form);
                form.submit();
            }
        }
    </script>
    <?php endif; ?>
</body>
</html>
