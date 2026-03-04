<?php
/**
 * Admin Contact Info Editor
 * Edit contact details shown on the public Contact page
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

// Handle POST update
$success_message = '';
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $allowed_keys = [
            'office_name', 'office_address',
            'phone_1', 'phone_2',
            'email_1', 'email_2',
            'business_hours',
            'map_lat', 'map_lng'
        ];

        foreach ($allowed_keys as $key) {
            if (isset($_POST[$key])) {
                $value = trim($_POST[$key]);
                Database::query(
                    "UPDATE site_settings SET setting_value = ? WHERE setting_key = ? AND setting_group = 'contact'",
                    [$value, $key]
                );
            }
        }

        // Log activity
        try {
            Database::insert('admin_logs', [
                'user_id'    => $_SESSION['admin_user_id'],
                'action'     => 'update_contact_settings',
                'table_name' => 'site_settings',
                'record_id'  => 'contact',
                'ip_address' => SecurityHelper::getClientIP()
            ]);
        } catch (Exception $e) {}

        $success_message = 'Contact information updated successfully!';
    } catch (Exception $e) {
        error_log('Contact settings update error: ' . $e->getMessage());
        $error_message = 'Failed to update settings. Please try again.';
    }
}

// Fetch current settings
try {
    $rows = Database::fetchAll(
        "SELECT setting_key, setting_value FROM site_settings WHERE setting_group = 'contact' ORDER BY id ASC"
    );
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
} catch (Exception $e) {
    error_log('Fetch contact settings error: ' . $e->getMessage());
    $settings = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Info - Admin Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

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

        h1 { font-size: 28px; color: #1a1a1a; }

        .header-actions { display: flex; gap: 10px; }

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

        nav a:hover { background: #e0e0e0; }
        nav a.active { background: #007bff; color: white; }

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

        .btn:hover { background: #0056b3; }

        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #545b62; }

        .btn-success { background: #28a745; }
        .btn-success:hover { background: #218838; }

        .message {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .message-success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }

        .message-error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
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

        .info-box strong { display: block; margin-bottom: 5px; }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .grid { grid-template-columns: 1fr; }
        }

        .card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }

        .card-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-header .icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
        }

        .icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-green { background: linear-gradient(135deg, #22c55e, #059669); }
        .icon-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }
        .icon-orange { background: linear-gradient(135deg, #f59e0b, #ea580c); }
        .icon-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

        .card-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .card-body { padding: 20px; }

        .form-group { margin-bottom: 16px; }
        .form-group:last-child { margin-bottom: 0; }

        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #555;
            margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            color: #333;
            transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-group textarea { resize: vertical; min-height: 80px; }

        .form-group .help-text {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }

        .form-actions {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .btn-save {
            padding: 12px 32px;
            font-size: 15px;
            font-weight: 600;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-save:hover { background: #218838; }

        .map-preview {
            background: #f0f0f0;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            overflow: hidden;
            height: 250px;
            margin-top: 12px;
        }

        .map-preview iframe {
            width: 100%;
            height: 100%;
            border: 0;
        }

        .coord-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📞 Contact Information</h1>
            <div class="header-actions" style="display: flex; gap: 12px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
                <a href="<?= BASE_PATH ?>/admin/index.php" class="btn btn-secondary">← Back to Dashboard</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php" class="active">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <?php if ($success_message): ?>
            <div class="message message-success"><?= htmlspecialchars($success_message) ?></div>
        <?php endif; ?>

        <?php if ($error_message): ?>
            <div class="message message-error"><?= htmlspecialchars($error_message) ?></div>
        <?php endif; ?>

        <div class="info-box">
            <strong>Edit Contact Page Information</strong>
            Update the contact details shown on the public Contact page. Changes take effect immediately.
        </div>

        <form method="POST" action="">
            <div class="grid">
                <!-- Office Info Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="icon icon-blue">📍</div>
                        <h3>Our Office</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Office / Company Name</label>
                            <input type="text" name="office_name" value="<?= htmlspecialchars($settings['office_name'] ?? '') ?>" placeholder="DIMA Certification Sdn Bhd">
                        </div>
                        <div class="form-group">
                            <label>Office Address</label>
                            <textarea name="office_address" rows="4" placeholder="Full address..."><?= htmlspecialchars($settings['office_address'] ?? '') ?></textarea>
                            <div class="help-text">Use new lines to separate address lines. Each line appears on the Contact page.</div>
                        </div>
                    </div>
                </div>

                <!-- Phone Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="icon icon-green">📱</div>
                        <h3>Phone Numbers</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Phone Number 1</label>
                            <input type="text" name="phone_1" value="<?= htmlspecialchars($settings['phone_1'] ?? '') ?>" placeholder="+60 12-345 6789">
                        </div>
                        <div class="form-group">
                            <label>Phone Number 2</label>
                            <input type="text" name="phone_2" value="<?= htmlspecialchars($settings['phone_2'] ?? '') ?>" placeholder="+60 82-123 456">
                            <div class="help-text">Leave blank to hide the second phone number.</div>
                        </div>
                    </div>
                </div>

                <!-- Email Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="icon icon-purple">✉️</div>
                        <h3>Email Addresses</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Email Address 1</label>
                            <input type="email" name="email_1" value="<?= htmlspecialchars($settings['email_1'] ?? '') ?>" placeholder="info@dima.com.my">
                        </div>
                        <div class="form-group">
                            <label>Email Address 2</label>
                            <input type="email" name="email_2" value="<?= htmlspecialchars($settings['email_2'] ?? '') ?>" placeholder="certification@dima.com.my">
                            <div class="help-text">Leave blank to hide the second email.</div>
                        </div>
                    </div>
                </div>

                <!-- Business Hours Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="icon icon-orange">🕐</div>
                        <h3>Business Hours</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Business Hours</label>
                            <textarea name="business_hours" rows="4" placeholder="Monday - Friday&#10;9:00 AM - 5:00 PM&#10;Closed on Public Holidays"><?= htmlspecialchars($settings['business_hours'] ?? '') ?></textarea>
                            <div class="help-text">Use new lines to separate each line. Each line appears separately on the Contact page.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Map Location - Full Width -->
            <div class="card" style="margin-top: 20px;">
                <div class="card-header">
                    <div class="icon icon-red">🗺️</div>
                    <h3>Map Location</h3>
                </div>
                <div class="card-body">
                    <div class="coord-inputs">
                        <div class="form-group">
                            <label>Latitude</label>
                            <input type="text" name="map_lat" id="map_lat" value="<?= htmlspecialchars($settings['map_lat'] ?? '') ?>" placeholder="1.4654755562789052">
                        </div>
                        <div class="form-group">
                            <label>Longitude</label>
                            <input type="text" name="map_lng" id="map_lng" value="<?= htmlspecialchars($settings['map_lng'] ?? '') ?>" placeholder="110.32736266883343">
                        </div>
                    </div>
                    <div class="help-text" style="margin-bottom: 12px;">
                        To get coordinates: Open <a href="https://www.google.com/maps" target="_blank">Google Maps</a>, right-click on the location, and click the coordinates to copy them.
                    </div>

                    <button type="button" class="btn" onclick="updatePreview()" style="margin-bottom: 12px;">🔄 Update Map Preview</button>

                    <div class="map-preview">
                        <iframe
                            id="map-preview-iframe"
                            src="https://maps.google.com/maps?q=<?= htmlspecialchars($settings['map_lat'] ?? '1.4654') ?>,<?= htmlspecialchars($settings['map_lng'] ?? '110.3273') ?>&z=18&ie=UTF8&iwloc=&output=embed"
                            allowfullscreen
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-save">💾 Save All Changes</button>
            </div>
        </form>
    </div>

    <script>
        function updatePreview() {
            const lat = document.getElementById('map_lat').value.trim();
            const lng = document.getElementById('map_lng').value.trim();
            if (lat && lng) {
                const iframe = document.getElementById('map-preview-iframe');
                iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(lat) + ',' + encodeURIComponent(lng) + '&z=18&ie=UTF8&iwloc=&output=embed';
            }
        }
    </script>
</body>
</html>
