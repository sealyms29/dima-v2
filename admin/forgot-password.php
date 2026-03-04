<?php
/**
 * Admin Forgot Password Page
 * Generates a reset token and emails the reset link
 */

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../includes/SecurityHelper.php';
require_once __DIR__ . '/../includes/MailHelper.php';

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

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        $error = 'Please enter your email address.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        try {
            // Look up user by email
            $user = Database::fetchOne(
                "SELECT id, username, email FROM admin_users WHERE email = ?",
                [$email]
            );

            if ($user) {
                // Invalidate any existing tokens for this user
                Database::query(
                    "UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0",
                    [$user['id']]
                );

                // Generate secure token
                $token = bin2hex(random_bytes(32));
                $expiresAt = date('Y-m-d H:i:s', strtotime('+' . RESET_TOKEN_EXPIRY . ' minutes'));

                // Store token
                Database::insert('password_reset_tokens', [
                    'user_id'    => $user['id'],
                    'token'      => $token,
                    'expires_at' => $expiresAt
                ]);

                // Send email
                $sent = MailHelper::sendPasswordResetEmail($user['email'], $user['username'], $token);

                if ($sent) {
                    $success = 'A password reset link has been sent to your email address. Please check your inbox.';
                } else {
                    // If mail not configured, show link directly (dev mode)
                    if (empty(MAIL_USERNAME) || empty(MAIL_PASSWORD)) {
                        $resetUrl = APP_BASE_URL . '/admin/reset-password.php?token=' . urlencode($token);
                        $success = 'Mail is not configured. <strong>Dev mode — use this link:</strong><br>'
                                 . '<a href="' . htmlspecialchars($resetUrl) . '" style="color:#667eea;word-break:break-all;">'
                                 . htmlspecialchars($resetUrl) . '</a>';
                    } else {
                        $error = 'Failed to send email. Please try again or contact the system administrator.';
                    }
                }
            } else {
                // Don't reveal whether email exists — show same success message
                $success = 'If an account with that email exists, a password reset link has been sent.';
            }
        } catch (Exception $e) {
            error_log('Forgot password error: ' . $e->getMessage());
            $error = 'An error occurred. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - DIMA Admin</title>
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

        input[type="email"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input[type="email"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrap">
            <div class="icon">🔑</div>
        </div>

        <h1>Forgot Password</h1>
        <p class="subtitle">Enter your admin email address and we'll send you a link to reset your password.</p>

        <?php if ($success): ?>
            <div class="alert alert-success"><?= $success ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if (!$success): ?>
        <form method="POST" action="">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required autofocus
                       placeholder="admin@dima.com.my"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
            </div>

            <button type="submit">Send Reset Link</button>
        </form>
        <?php endif; ?>

        <div class="back-link">
            <a href="<?= BASE_PATH ?>/admin/login.php">← Back to Login</a>
        </div>
    </div>
</body>
</html>
