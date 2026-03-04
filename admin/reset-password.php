<?php
/**
 * Admin Reset Password Page
 * Validates reset token and allows user to set a new password
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

// If already logged in, redirect
if (isset($_SESSION['admin_user_id'])) {
    header('Location: ' . BASE_PATH . '/admin/index.php');
    exit;
}

$token = $_GET['token'] ?? $_POST['token'] ?? '';
$success = '';
$error = '';
$tokenValid = false;

// Validate token
function validateToken($token) {
    if (empty($token) || strlen($token) !== 64) {
        return null;
    }

    $result = Database::fetchOne(
        "SELECT prt.*, au.username, au.email
         FROM password_reset_tokens prt
         JOIN admin_users au ON au.id = prt.user_id
         WHERE prt.token = ? AND prt.used = 0 AND prt.expires_at > NOW()",
        [$token]
    );

    return $result;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    $passwordConfirm = $_POST['password_confirm'] ?? '';

    $tokenData = validateToken($token);

    if (!$tokenData) {
        $error = 'This reset link is invalid or has expired. Please request a new one.';
    } elseif (empty($password)) {
        $error = 'Please enter a new password.';
        $tokenValid = true;
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters long.';
        $tokenValid = true;
    } elseif ($password !== $passwordConfirm) {
        $error = 'Passwords do not match.';
        $tokenValid = true;
    } else {
        try {
            // Update password
            $hash = password_hash($password, PASSWORD_DEFAULT);
            Database::query(
                "UPDATE admin_users SET password_hash = ? WHERE id = ?",
                [$hash, $tokenData['user_id']]
            );

            // Mark token as used
            Database::query(
                "UPDATE password_reset_tokens SET used = 1 WHERE id = ?",
                [$tokenData['id']]
            );

            // Invalidate all other tokens for this user
            Database::query(
                "UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0",
                [$tokenData['user_id']]
            );

            $success = 'Your password has been reset successfully! You can now log in with your new password.';
        } catch (Exception $e) {
            error_log('Password reset error: ' . $e->getMessage());
            $error = 'An error occurred. Please try again.';
            $tokenValid = true;
        }
    }
} else {
    // GET request — validate the token
    $tokenData = validateToken($token);
    if ($tokenData) {
        $tokenValid = true;
    } else {
        $error = 'This reset link is invalid or has expired. Please request a new one.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - DIMA Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 420px;
            padding: 40px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 8px;
            font-size: 26px;
        }

        .subtitle {
            text-align: center;
            color: #999;
            margin-bottom: 28px;
            font-size: 14px;
            line-height: 1.5;
        }

        .icon-wrap {
            text-align: center;
            margin-bottom: 20px;
        }

        .icon-wrap .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            font-size: 28px;
        }

        .alert {
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.5;
        }

        .alert-success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }

        .alert-error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }

        .form-group { margin-bottom: 20px; }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }

        input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-requirements {
            font-size: 12px;
            color: #999;
            margin-top: 6px;
        }

        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        button:active { transform: translateY(0); }

        .back-link {
            text-align: center;
            margin-top: 20px;
        }

        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }

        .back-link a:hover { text-decoration: underline; }

        .strength-meter {
            height: 4px;
            background: #eee;
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }

        .strength-meter .bar {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s, background 0.3s;
            width: 0%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrap">
            <div class="icon">🔒</div>
        </div>

        <h1>Reset Password</h1>

        <?php if ($success): ?>
            <p class="subtitle">Your password has been updated.</p>
            <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
            <div class="back-link">
                <a href="<?= BASE_PATH ?>/admin/login.php">← Go to Login</a>
            </div>
        <?php elseif ($tokenValid): ?>
            <p class="subtitle">Enter your new password below.</p>

            <?php if ($error): ?>
                <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">

                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" name="password" required autofocus
                           placeholder="Enter new password" minlength="6">
                    <div class="strength-meter"><div class="bar" id="strengthBar"></div></div>
                    <p class="password-requirements">Minimum 6 characters</p>
                </div>

                <div class="form-group">
                    <label for="password_confirm">Confirm New Password</label>
                    <input type="password" id="password_confirm" name="password_confirm" required
                           placeholder="Confirm new password" minlength="6">
                </div>

                <button type="submit">Reset Password</button>
            </form>

            <div class="back-link">
                <a href="<?= BASE_PATH ?>/admin/login.php">← Back to Login</a>
            </div>
        <?php else: ?>
            <p class="subtitle">This reset link is not valid.</p>

            <?php if ($error): ?>
                <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <div class="back-link" style="margin-top: 0;">
                <a href="<?= BASE_PATH ?>/admin/forgot-password.php">Request a new reset link</a>
                <br><br>
                <a href="<?= BASE_PATH ?>/admin/login.php">← Back to Login</a>
            </div>
        <?php endif; ?>
    </div>

    <script>
        // Password strength meter
        const pw = document.getElementById('password');
        const bar = document.getElementById('strengthBar');
        if (pw && bar) {
            pw.addEventListener('input', function() {
                const val = this.value;
                let score = 0;
                if (val.length >= 6) score++;
                if (val.length >= 10) score++;
                if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
                if (/[0-9]/.test(val)) score++;
                if (/[^a-zA-Z0-9]/.test(val)) score++;

                const pct = Math.min(score / 5 * 100, 100);
                const colors = ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50'];
                bar.style.width = pct + '%';
                bar.style.background = colors[Math.min(score, 4)] || '#eee';
            });
        }
    </script>
</body>
</html>
