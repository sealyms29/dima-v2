<?php
/**
 * Admin Account Settings Page
 * Manage profile info, email (for notifications/reset), and change password
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

// Fetch current user data
$user = Database::fetchOne(
    "SELECT id, username, full_name, email, phone, role, last_login, created_at FROM admin_users WHERE id = ?",
    [$_SESSION['admin_user_id']]
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Settings - Admin Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f5;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }

        header h1 { font-size: 24px; color: #333; }

        .user-info {
            color: #666;
            font-size: 14px;
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
        }

        .logout-btn:hover { background: #c82333; }

        nav {
            background: white;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        nav a {
            text-decoration: none;
            color: #555;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s, color 0.2s;
        }

        nav a:hover {
            background: #f0f0f0;
            color: #333;
        }

        nav a.active {
            background: #667eea;
            color: white;
        }

        /* Page layout */
        .settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        @media (max-width: 768px) {
            .settings-grid { grid-template-columns: 1fr; }
        }

        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
        }

        .card-header {
            padding: 20px 24px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-header h2 {
            font-size: 18px;
            color: #333;
            margin: 0;
        }

        .card-header .icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .card-body { padding: 24px; }

        .form-group {
            margin-bottom: 18px;
        }

        .form-group:last-child { margin-bottom: 0; }

        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #555;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input[readonly] {
            background: #f8f8f8;
            color: #888;
            cursor: not-allowed;
        }

        .form-group .hint {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }

        .form-group .hint.important {
            color: #e67e22;
            font-weight: 500;
        }

        .btn-row {
            display: flex;
            justify-content: flex-end;
            padding-top: 10px;
        }

        .btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn:active { transform: translateY(0); }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-warning {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        /* Toast */
        .toast {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 14px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }

        .toast.success { background: #27ae60; }
        .toast.error { background: #e74c3c; }

        /* Info cards */
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child { border-bottom: none; }

        .info-label {
            font-size: 13px;
            color: #888;
            font-weight: 500;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 600;
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-admin {
            background: #e8eaf6;
            color: #3f51b5;
        }

        /* Full width card */
        .full-width {
            grid-column: 1 / -1;
        }

        /* Password strength */
        .strength-bar {
            height: 4px;
            background: #eee;
            border-radius: 2px;
            margin-top: 6px;
            overflow: hidden;
        }

        .strength-bar .fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s, background 0.3s;
            width: 0%;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>⚙️ Account Settings</h1>
            <div style="display: flex; gap: 20px; align-items: center;">
                <span class="user-info">Logged in as: <?= htmlspecialchars($user['username']) ?></span>
                <a href="<?= BASE_PATH ?>/admin/logout.php" class="logout-btn">Logout</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php" class="active">Settings</a>
        </nav>

        <div class="settings-grid">
            <!-- Profile Info Card -->
            <div class="card">
                <div class="card-header">
                    <div class="icon">👤</div>
                    <h2>Profile Information</h2>
                </div>
                <div class="card-body">
                    <form id="profileForm">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" value="<?= htmlspecialchars($user['username']) ?>" readonly>
                            <p class="hint">Username cannot be changed</p>
                        </div>

                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="full_name" id="fullName"
                                   value="<?= htmlspecialchars($user['full_name'] ?? '') ?>"
                                   placeholder="Enter your full name">
                        </div>

                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" id="phone"
                                   value="<?= htmlspecialchars($user['phone'] ?? '') ?>"
                                   placeholder="e.g. +60 12-345 6789">
                        </div>

                        <div class="btn-row">
                            <button type="submit" class="btn btn-primary">Save Profile</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Email & Notifications Card -->
            <div class="card">
                <div class="card-header">
                    <div class="icon">📧</div>
                    <h2>Email & Notifications</h2>
                </div>
                <div class="card-body">
                    <form id="emailForm">
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" id="email"
                                   value="<?= htmlspecialchars($user['email'] ?? '') ?>"
                                   placeholder="admin@dima.com.my" required>
                            <p class="hint important">⚠️ This email is used to receive password reset links and system notifications. Make sure it's a working email you can access.</p>
                        </div>

                        <div class="btn-row">
                            <button type="submit" class="btn btn-primary">Update Email</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Change Password Card -->
            <div class="card">
                <div class="card-header">
                    <div class="icon">🔒</div>
                    <h2>Change Password</h2>
                </div>
                <div class="card-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" name="current_password" id="currentPassword"
                                   placeholder="Enter current password" required>
                        </div>

                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" name="new_password" id="newPassword"
                                   placeholder="Enter new password" required minlength="6">
                            <div class="strength-bar"><div class="fill" id="strengthFill"></div></div>
                            <p class="hint">Minimum 6 characters</p>
                        </div>

                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm_password" id="confirmPassword"
                                   placeholder="Confirm new password" required minlength="6">
                        </div>

                        <div class="btn-row">
                            <button type="submit" class="btn btn-warning">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Account Info Card -->
            <div class="card">
                <div class="card-header">
                    <div class="icon">ℹ️</div>
                    <h2>Account Information</h2>
                </div>
                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">Role</span>
                        <span class="badge badge-admin"><?= htmlspecialchars($user['role'] ?? 'admin') ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Last Login</span>
                        <span class="info-value"><?= $user['last_login'] ? date('d M Y, h:i A', strtotime($user['last_login'])) : 'Never' ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Account Created</span>
                        <span class="info-value"><?= date('d M Y', strtotime($user['created_at'])) ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">User ID</span>
                        <span class="info-value">#<?= $user['id'] ?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast notification -->
    <div class="toast" id="toast"></div>

    <script>
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast ' + type + ' show';
            setTimeout(() => { toast.classList.remove('show'); }, 4000);
        }

        // Password strength meter
        const newPw = document.getElementById('newPassword');
        const fill = document.getElementById('strengthFill');
        if (newPw && fill) {
            newPw.addEventListener('input', function() {
                const val = this.value;
                let score = 0;
                if (val.length >= 6) score++;
                if (val.length >= 10) score++;
                if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
                if (/[0-9]/.test(val)) score++;
                if (/[^a-zA-Z0-9]/.test(val)) score++;
                const pct = Math.min(score / 5 * 100, 100);
                const colors = ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50'];
                fill.style.width = pct + '%';
                fill.style.background = colors[Math.min(score, 4)] || '#eee';
            });
        }

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Saving...';

            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-profile.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_profile',
                        full_name: document.getElementById('fullName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message || 'Profile updated!', 'success');
                } else {
                    showToast(data.error || 'Failed to update.', 'error');
                }
            } catch (err) {
                showToast('Network error.', 'error');
            }

            btn.disabled = false;
            btn.textContent = 'Save Profile';
        });

        // Email form
        document.getElementById('emailForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Updating...';

            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-profile.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_profile',
                        full_name: document.getElementById('fullName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message || 'Email updated!', 'success');
                } else {
                    showToast(data.error || 'Failed to update.', 'error');
                }
            } catch (err) {
                showToast('Network error.', 'error');
            }

            btn.disabled = false;
            btn.textContent = 'Update Email';
        });

        // Password form
        document.getElementById('passwordForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const newPw = document.getElementById('newPassword').value;
            const confirmPw = document.getElementById('confirmPassword').value;

            if (newPw !== confirmPw) {
                showToast('Passwords do not match.', 'error');
                return;
            }

            if (newPw.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }

            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Changing...';

            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-profile.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'change_password',
                        current_password: document.getElementById('currentPassword').value,
                        new_password: newPw,
                        confirm_password: confirmPw
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message || 'Password changed!', 'success');
                    this.reset();
                    fill.style.width = '0%';
                } else {
                    showToast(data.error || 'Failed to change password.', 'error');
                }
            } catch (err) {
                showToast('Network error.', 'error');
            }

            btn.disabled = false;
            btn.textContent = 'Change Password';
        });
    </script>
</body>
</html>
