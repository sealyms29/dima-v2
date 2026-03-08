<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * Admin - Certification Agreement Management
 * Upload and manage the certification agreement PDF
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

$message = '';
$message_type = '';

// Upload directory
$uploadDir = __DIR__ . '/../uploads/documents/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Fetch current agreement
$agreement = Database::fetchOne("SELECT * FROM certification_agreement WHERE id = 1");

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'update_info') {
        // Update title, description, version
        $title = SecurityHelper::sanitizeString($_POST['title'] ?? '');
        $description = SecurityHelper::sanitizeString($_POST['description'] ?? '');
        $version = SecurityHelper::sanitizeString($_POST['version'] ?? '');
        $issue_date = $_POST['issue_date'] ?? null;
        
        if (!empty($title)) {
            try {
                Database::execute(
                    "UPDATE certification_agreement SET title = ?, description = ?, version = ?, issue_date = ?, updated_by = ?, updated_at = NOW() WHERE id = 1",
                    [$title, $description, $version, $issue_date, $_SESSION['admin_user_id']]
                );
                $message = 'Agreement info updated successfully';
                $message_type = 'success';
                $agreement = Database::fetchOne("SELECT * FROM certification_agreement WHERE id = 1");
            } catch (Exception $e) {
                $message = 'Error updating info: ' . $e->getMessage();
                $message_type = 'error';
            }
        }
    } elseif ($action === 'upload_pdf') {
        // Handle PDF upload
        if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['pdf_file'];
            
            // Validate file type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            
            if ($mime !== 'application/pdf') {
                $message = 'Only PDF files are allowed';
                $message_type = 'error';
            } elseif ($file['size'] > 10485760) { // 10MB
                $message = 'File size exceeds 10MB limit';
                $message_type = 'error';
            } else {
                // Generate filename
                $filename = 'certification_agreement_' . time() . '.pdf';
                $filepath = $uploadDir . $filename;
                
                // Delete old file if exists
                if (!empty($agreement['file_path'])) {
                    $oldFile = __DIR__ . '/..' . $agreement['file_path'];
                    if (file_exists($oldFile)) {
                        unlink($oldFile);
                    }
                }
                
                // Move uploaded file
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $dbPath = '/uploads/documents/' . $filename;
                    try {
                        Database::execute(
                            "UPDATE certification_agreement SET file_path = ?, file_name = ?, file_size = ?, updated_by = ?, updated_at = NOW() WHERE id = 1",
                            [$dbPath, $file['name'], $file['size'], $_SESSION['admin_user_id']]
                        );
                        $message = 'PDF uploaded successfully';
                        $message_type = 'success';
                        $agreement = Database::fetchOne("SELECT * FROM certification_agreement WHERE id = 1");
                    } catch (Exception $e) {
                        $message = 'Error saving to database: ' . $e->getMessage();
                        $message_type = 'error';
                    }
                } else {
                    $message = 'Error moving uploaded file';
                    $message_type = 'error';
                }
            }
        } else {
            $message = 'Please select a PDF file to upload';
            $message_type = 'error';
        }
    } elseif ($action === 'delete_pdf') {
        // Delete PDF
        if (!empty($agreement['file_path'])) {
            $oldFile = __DIR__ . '/..' . $agreement['file_path'];
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
            try {
                Database::execute(
                    "UPDATE certification_agreement SET file_path = NULL, file_name = NULL, file_size = NULL, updated_by = ?, updated_at = NOW() WHERE id = 1",
                    [$_SESSION['admin_user_id']]
                );
                $message = 'PDF deleted successfully';
                $message_type = 'success';
                $agreement = Database::fetchOne("SELECT * FROM certification_agreement WHERE id = 1");
            } catch (Exception $e) {
                $message = 'Error deleting PDF: ' . $e->getMessage();
                $message_type = 'error';
            }
        }
    }
}

// If no record exists, create one
if (!$agreement) {
    Database::execute(
        "INSERT INTO certification_agreement (id, title, description, version, issue_date) VALUES (1, 'DMC/ISO/QCA Quotation Certification Agreement', '', 'Issue 1', '2024-10-17')"
    );
    $agreement = Database::fetchOne("SELECT * FROM certification_agreement WHERE id = 1");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certification Agreement - Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
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
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 { font-size: 24px; color: #1a1a1a; }

        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
        }

        nav {
            background: white;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        nav a {
            padding: 8px 16px;
            background: #f0f0f0;
            color: #333;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
        }

        nav a:hover { background: #e0e0e0; }
        nav a.active { background: #d4af37; color: white; }

        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .card h2 {
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            font-weight: 500;
            margin-bottom: 6px;
            color: #444;
        }

        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #d4af37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #d4af37;
            color: white;
        }

        .btn-primary:hover {
            background: #c49f2e;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        .file-icon {
            width: 48px;
            height: 48px;
            background: #dc3545;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .file-details {
            flex: 1;
        }

        .file-details .name {
            font-weight: 500;
            margin-bottom: 4px;
        }

        .file-details .meta {
            font-size: 13px;
            color: #666;
        }

        .file-actions {
            display: flex;
            gap: 8px;
        }

        .no-file {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 8px;
            color: #666;
        }

        .upload-area {
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            background: #fafafa;
            margin-top: 16px;
        }

        .upload-area input[type="file"] {
            margin-bottom: 12px;
        }

        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        @media (max-width: 600px) {
            .row { grid-template-columns: 1fr; }
            .file-info { flex-direction: column; text-align: center; }
            .file-actions { justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Certification Agreement</h1>
            <a href="logout.php" class="logout-btn">Logout</a>
        </header>

        <nav>
            <a href="index.php">Dashboard</a>
            <a href="submissions.php">Submissions</a>
            <a href="gallery.php">Gallery</a>
            <a href="downloadable_forms.php">Downloadable Forms</a>
            <a href="documents.php">MSPO Documents</a>
            <a href="certification_agreement.php" class="active">Certification Agreement</a>
            <a href="contact-info.php">Contact Info</a>
            <a href="settings.php">Settings</a>
        </nav>

        <?php if ($message): ?>
            <div class="alert alert-<?= $message_type ?>">
                <?= SecurityHelper::escapeHTML($message) ?>
            </div>
        <?php endif; ?>

        <!-- Current PDF Section -->
        <div class="card">
            <h2>Current PDF Document</h2>
            
            <?php if (!empty($agreement['file_path'])): ?>
                <div class="file-info">
                    <div class="file-icon">PDF</div>
                    <div class="file-details">
                        <div class="name"><?= SecurityHelper::escapeHTML($agreement['file_name'] ?? 'certification_agreement.pdf') ?></div>
                        <div class="meta">
                            <?php if ($agreement['file_size']): ?>
                                Size: <?= number_format($agreement['file_size'] / 1024, 1) ?> KB |
                            <?php endif; ?>
                            Updated: <?= date('M j, Y g:i A', strtotime($agreement['updated_at'])) ?>
                        </div>
                    </div>
                    <div class="file-actions">
                        <a href="<?= SecurityHelper::escapeHTML($agreement['file_path']) ?>" target="_blank" class="btn btn-secondary">View</a>
                        <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this PDF?');">
                            <input type="hidden" name="action" value="delete_pdf">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            <?php else: ?>
                <div class="no-file">
                    <p>No PDF uploaded yet</p>
                    <p style="font-size: 13px; margin-top: 8px;">Upload a PDF below to make it available for download on the website.</p>
                </div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="upload_pdf">
                <div class="upload-area">
                    <p style="margin-bottom: 12px; font-weight: 500;">Upload New PDF</p>
                    <input type="file" name="pdf_file" accept="application/pdf" required>
                    <br><br>
                    <button type="submit" class="btn btn-primary">Upload PDF</button>
                    <p style="font-size: 12px; color: #888; margin-top: 8px;">Max file size: 10MB. PDF files only.</p>
                </div>
            </form>
        </div>

        <!-- Agreement Info Section -->
        <div class="card">
            <h2>Document Information</h2>
            
            <form method="POST">
                <input type="hidden" name="action" value="update_info">
                
                <div class="form-group">
                    <label for="title">Document Title</label>
                    <input type="text" id="title" name="title" value="<?= SecurityHelper::escapeHTML($agreement['title'] ?? '') ?>" required>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description"><?= SecurityHelper::escapeHTML($agreement['description'] ?? '') ?></textarea>
                </div>

                <div class="row">
                    <div class="form-group">
                        <label for="version">Version / Issue</label>
                        <input type="text" id="version" name="version" value="<?= SecurityHelper::escapeHTML($agreement['version'] ?? '') ?>" placeholder="e.g., Issue 1">
                    </div>

                    <div class="form-group">
                        <label for="issue_date">Issue Date</label>
                        <input type="date" id="issue_date" name="issue_date" value="<?= $agreement['issue_date'] ?? '' ?>">
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Save Information</button>
            </form>
        </div>
    </div>
</body>
</html>
