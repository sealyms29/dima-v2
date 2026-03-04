<?php
/**
 * Admin Content Management Page
 * Manage visibility of ISO content blocks (read-only content, visibility toggles only)
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

// Handle visibility toggle via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['iso_standard'], $_POST['block_key'])) {
    $iso_standard = SecurityHelper::sanitizeString($_POST['iso_standard']);
    $block_key = SecurityHelper::sanitizeString($_POST['block_key']);
    $is_visible = intval($_POST['is_visible']);

    try {
        DBTransaction::begin();

        Database::query(
            "UPDATE iso_content_blocks SET is_visible = ? WHERE iso_standard = ? AND block_key = ?",
            [$is_visible, $iso_standard, $block_key]
        );

        log_activity('update_visibility', 'iso_content_blocks', "$iso_standard:$block_key");

        DBTransaction::commit();
        $_SESSION['message'] = 'Visibility updated successfully';
    } catch (Exception $e) {
        DBTransaction::rollback();
        error_log('Update visibility error: ' . $e->getMessage());
    }
}

// Fetch all ISO content blocks grouped by standard
try {
    $blocks = Database::fetchAll("SELECT * FROM iso_content_blocks ORDER BY iso_standard, order_index ASC");
    
    $grouped_blocks = [];
    foreach ($blocks as $block) {
        $standard = $block['iso_standard'];
        if (!isset($grouped_blocks[$standard])) {
            $grouped_blocks[$standard] = [];
        }
        $grouped_blocks[$standard][] = $block;
    }
} catch (Exception $e) {
    error_log('Fetch blocks error: ' . $e->getMessage());
    $grouped_blocks = [];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management - Admin Dashboard</title>
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
            font-size: 28px;
            color: #1a1a1a;
        }

        .header-actions {
            display: flex;
            gap: 10px;
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

        nav a:hover {
            background: #e0e0e0;
        }

        nav a.active {
            background: #007bff;
            color: white;
        }

        .btn {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }

        .btn:hover {
            background: #0056b3;
        }

        .btn-secondary {
            background: #6c757d;
        }

        .btn-secondary:hover {
            background: #545b62;
        }

        .message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .section {
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .section-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .section-content {
            padding: 0;
        }

        .block-item {
            padding: 15px 20px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .block-item:last-child {
            border-bottom: none;
        }

        .block-info h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .block-info p {
            font-size: 13px;
            color: #666;
            margin: 0;
        }

        .block-key {
            font-family: monospace;
            font-size: 12px;
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            color: #666;
        }

        .toggle-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .status-badge {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 3px;
            font-weight: 500;
        }

        .status-badge.visible {
            background: #d4edda;
            color: #155724;
        }

        .status-badge.hidden {
            background: #f8d7da;
            color: #721c24;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            border-radius: 24px;
            transition: .3s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            border-radius: 50%;
            transition: .3s;
        }

        input:checked + .slider {
            background-color: #28a745;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }

        .empty-message {
            padding: 30px 20px;
            text-align: center;
            color: #999;
        }

        .info-box {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            color: #004085;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .info-box strong {
            display: block;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📝 Content Management</h1>
            <div class="header-actions">
                <a href="<?= BASE_PATH ?>/admin/index.php" class="btn btn-secondary">← Back to Dashboard</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php" class="active">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <?php if (isset($_SESSION['message'])): ?>
            <div class="message"><?php echo htmlspecialchars($_SESSION['message']); unset($_SESSION['message']); ?></div>
        <?php endif; ?>

        <div class="info-box">
            <strong>Content Visibility Management</strong>
            Use the toggles below to control which content blocks are visible on the web pages. Note: You cannot edit the content itself, only its visibility status.
        </div>

        <?php if (!empty($grouped_blocks)): ?>
            <?php foreach ($grouped_blocks as $standard => $blocks): ?>
                <div class="section">
                    <div class="section-header">
                        ISO <?php echo htmlspecialchars($standard); ?>
                    </div>
                    <div class="section-content">
                        <?php foreach ($blocks as $block): ?>
                            <div class="block-item">
                                <div class="block-info">
                                    <h3><?php echo htmlspecialchars($block['title']); ?></h3>
                                    <p>Key: <span class="block-key"><?php echo htmlspecialchars($block['block_key']); ?></span></p>
                                </div>

                                <div class="toggle-group">
                                    <span class="status-badge <?php echo $block['is_visible'] ? 'visible' : 'hidden'; ?>">
                                        <?php echo $block['is_visible'] ? 'Visible' : 'Hidden'; ?>
                                    </span>

                                    <form method="post" style="display: inline;">
                                        <input type="hidden" name="iso_standard" value="<?php echo htmlspecialchars($block['iso_standard']); ?>">
                                        <input type="hidden" name="block_key" value="<?php echo htmlspecialchars($block['block_key']); ?>">
                                        <input type="hidden" name="is_visible" value="<?php echo $block['is_visible'] ? 0 : 1; ?>">
                                        
                                        <label class="toggle-switch">
                                            <input type="checkbox" <?php echo $block['is_visible'] ? 'checked' : ''; ?> 
                                                   onchange="this.form.submit()">
                                            <span class="slider"></span>
                                        </label>
                                    </form>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="section">
                <div class="empty-message">
                    <p>No content blocks found in the database.</p>
                    <p style="font-size: 12px; margin-top: 10px; color: #999;">
                        Content blocks will appear here after the database is populated.
                    </p>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

<?php

function log_activity($action, $table_name, $record_id, $old_value = null, $new_value = null) {
    try {
        Database::insert('admin_logs', [
            'user_id' => $_SESSION['admin_user_id'] ?? null,
            'action' => $action,
            'table_name' => $table_name,
            'record_id' => $record_id,
            'old_value' => $old_value,
            'new_value' => $new_value,
            'ip_address' => SecurityHelper::getClientIP()
        ]);
    } catch (Exception $e) {
        error_log('Failed to log activity: ' . $e->getMessage());
    }
}

?>
