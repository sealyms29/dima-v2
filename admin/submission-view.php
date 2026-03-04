<?php
/**
 * Admin Submission Detail Page
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

$type = $_GET['type'] ?? '';
$id = intval($_GET['id'] ?? 0);

if (!in_array($type, ['quotation', 'contact', 'complaint']) || $id <= 0) {
    header('Location: ' . BASE_PATH . '/admin/submissions.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_status = SecurityHelper::sanitizeString($_POST['status'] ?? '');
    $notes = SecurityHelper::sanitizeString($_POST['notes'] ?? '');

    // Send to API
    $api_url = 'http://' . $_SERVER['HTTP_HOST'] . BASE_PATH . '/api/admin-submissions-update.php';
    $post_data = json_encode([
        'type' => $type,
        'id' => $id,
        'status' => $new_status,
        'notes' => $notes
    ]);

    $options = stream_context_create([
        'http' => [
            'method' => 'PATCH',
            'header' => 'Content-Type: application/json',
            'content' => $post_data,
            'cookie' => session_name() . '=' . session_id()
        ]
    ]);

    $response = @file_get_contents($api_url, false, $options);
    if ($response) {
        $json = json_decode($response, true);
        if ($json['success']) {
            $_SESSION['message'] = 'Submission updated successfully';
        }
    }
}

// Fetch submission detail
$api_url = 'http://' . $_SERVER['HTTP_HOST'] . BASE_PATH . '/api/admin-submission-detail.php?type=' . urlencode($type) . '&id=' . $id;
$response = @file_get_contents($api_url);
$submission = null;

if ($response) {
    $json = json_decode($response, true);
    if ($json['success']) {
        $submission = $json['data'];
    }
}

if (!$submission) {
    header('Location: ' . BASE_PATH . '/admin/submissions.php?type=' . urlencode($type));
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Details - Admin Dashboard</title>
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

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .section {
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            margin-bottom: 20px;
        }

        .section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #1a1a1a;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }

        .field-group {
            margin-bottom: 15px;
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 20px;
        }

        .field-label {
            font-weight: 600;
            color: #666;
            font-size: 14px;
        }

        .field-value {
            color: #333;
            font-size: 14px;
            word-break: break-word;
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

        .badge-under_review {
            background: #d1ecf1;
            color: #0c5460;
        }

        .badge-resolved {
            background: #d4edda;
            color: #155724;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 14px;
        }

        select, textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        select {
            cursor: pointer;
        }

        button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        button:hover {
            background: #0056b3;
        }

        .message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Submission Details</h1>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <a href="<?= BASE_PATH ?>/admin/submissions.php?type=<?php echo urlencode($type); ?>" class="back-link">← Back to Submissions</a>

        <?php if (isset($_SESSION['message'])): ?>
            <div class="message"><?php echo htmlspecialchars($_SESSION['message']); unset($_SESSION['message']); ?></div>
        <?php endif; ?>

        <!-- Submission Details -->
        <div class="section">
            <h2>Information</h2>

            <div class="field-group">
                <span class="field-label">ID:</span>
                <span class="field-value">#<?php echo htmlspecialchars($submission['id']); ?></span>
            </div>

            <div class="field-group">
                <span class="field-label">Type:</span>
                <span class="field-value"><?php echo ucfirst($type); ?></span>
            </div>

            <div class="field-group">
                <span class="field-label">Name:</span>
                <span class="field-value"><?php echo htmlspecialchars($submission['name']); ?></span>
            </div>

            <div class="field-group">
                <span class="field-label">Email:</span>
                <span class="field-value"><a href="mailto:<?php echo htmlspecialchars($submission['email']); ?>"><?php echo htmlspecialchars($submission['email']); ?></a></span>
            </div>

            <div class="field-group">
                <span class="field-label">Phone:</span>
                <span class="field-value"><a href="tel:<?php echo htmlspecialchars($submission['phone']); ?>"><?php echo htmlspecialchars($submission['phone']); ?></a></span>
            </div>

            <?php if ($type !== 'complaint'): ?>
                <div class="field-group">
                    <span class="field-label">Company:</span>
                    <span class="field-value"><?php echo htmlspecialchars($submission['company'] ?? ''); ?></span>
                </div>

                <div class="field-group">
                    <span class="field-label">Message:</span>
                    <span class="field-value"><?php echo nl2br(htmlspecialchars($submission['message'])); ?></span>
                </div>
            <?php else: ?>
                <div class="field-group">
                    <span class="field-label">Organization:</span>
                    <span class="field-value"><?php echo htmlspecialchars($submission['organization'] ?? ''); ?></span>
                </div>

                <div class="field-group">
                    <span class="field-label">Programme:</span>
                    <span class="field-value"><?php echo htmlspecialchars($submission['programme'] ?? ''); ?></span>
                </div>

                <div class="field-group">
                    <span class="field-label">Type:</span>
                    <span class="field-value"><?php echo htmlspecialchars($submission['complaint_type'] ?? ''); ?></span>
                </div>

                <?php if (!empty($submission['iso_standard'])): ?>
                    <div class="field-group">
                        <span class="field-label">ISO Standard:</span>
                        <span class="field-value">ISO <?php echo htmlspecialchars($submission['iso_standard']); ?></span>
                    </div>
                <?php endif; ?>

                <div class="field-group">
                    <span class="field-label">Description:</span>
                    <span class="field-value"><?php echo nl2br(htmlspecialchars($submission['description'] ?? '')); ?></span>
                </div>

                <?php if (!empty($submission['evidence'])): ?>
                    <div class="field-group">
                        <span class="field-label">Evidence:</span>
                        <span class="field-value"><?php echo nl2br(htmlspecialchars($submission['evidence'])); ?></span>
                    </div>
                <?php endif; ?>
            <?php endif; ?>

            <div class="field-group">
                <span class="field-label">Status:</span>
                <span class="field-value">
                    <span class="badge badge-<?php echo strtolower($submission['status']); ?>">
                        <?php echo ucfirst(str_replace('_', ' ', $submission['status'])); ?>
                    </span>
                </span>
            </div>

            <div class="field-group">
                <span class="field-label">Submitted:</span>
                <span class="field-value"><?php echo date('M d, Y g:i A', strtotime($submission['created_at'])); ?></span>
            </div>

            <?php if (!empty($submission['updated_at'])): ?>
                <div class="field-group">
                    <span class="field-label">Updated:</span>
                    <span class="field-value"><?php echo date('M d, Y g:i A', strtotime($submission['updated_at'])); ?></span>
                </div>
            <?php endif; ?>
        </div>

        <!-- Update Form -->
        <div class="section">
            <h2>Update Status & Notes</h2>

            <form method="post">
                <div class="form-group">
                    <label for="status">Status:</label>
                    <select name="status" id="status" required>
                        <?php if ($type === 'complaint'): ?>
                            <option value="new" <?php echo $submission['status'] === 'new' ? 'selected' : ''; ?>>New</option>
                            <option value="under_review" <?php echo $submission['status'] === 'under_review' ? 'selected' : ''; ?>>Under Review</option>
                            <option value="responded" <?php echo $submission['status'] === 'responded' ? 'selected' : ''; ?>>Responded</option>
                            <option value="resolved" <?php echo $submission['status'] === 'resolved' ? 'selected' : ''; ?>>Resolved</option>
                            <option value="closed" <?php echo $submission['status'] === 'closed' ? 'selected' : ''; ?>>Closed</option>
                        <?php else: ?>
                            <option value="new" <?php echo $submission['status'] === 'new' ? 'selected' : ''; ?>>New</option>
                            <option value="viewed" <?php echo $submission['status'] === 'viewed' ? 'selected' : ''; ?>>Viewed</option>
                            <option value="responded" <?php echo $submission['status'] === 'responded' ? 'selected' : ''; ?>>Responded</option>
                            <option value="closed" <?php echo $submission['status'] === 'closed' ? 'selected' : ''; ?>>Closed</option>
                        <?php endif; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="notes">Internal Notes:</label>
                    <textarea name="notes" id="notes" placeholder="Add notes for internal tracking..."><?php echo htmlspecialchars($submission['notes'] ?? $submission['internal_notes'] ?? ''); ?></textarea>
                </div>

                <button type="submit">Update Submission</button>
            </form>
        </div>
    </div>
</body>
</html>
