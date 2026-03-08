<?php
/**
 * Email Diagnostic Script - Upload to live server root, run once, then DELETE
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>DIMA Email Diagnostic</h2>";

// 1. Check mail-config.php
echo "<h3>1. Mail Config</h3>";
$mailConfig = __DIR__ . '/includes/mail-config.php';
if (file_exists($mailConfig)) {
    require_once $mailConfig;
    echo "<p style='color:green;'>✓ mail-config.php exists</p>";
    echo "<p>MAIL_HOST: " . MAIL_HOST . "</p>";
    echo "<p>MAIL_PORT: " . MAIL_PORT . "</p>";
    echo "<p>MAIL_USERNAME: " . MAIL_USERNAME . "</p>";
    echo "<p>MAIL_PASSWORD: " . (empty(MAIL_PASSWORD) ? 'NOT SET' : str_repeat('*', strlen(MAIL_PASSWORD)) . ' (' . strlen(MAIL_PASSWORD) . ' chars)') . "</p>";
    echo "<p>MAIL_FROM: " . MAIL_FROM . "</p>";
} else {
    echo "<p style='color:red;'>✗ mail-config.php NOT FOUND at: {$mailConfig}</p>";
}

// 2. Check vendor/autoload.php (PHPMailer)
echo "<h3>2. PHPMailer</h3>";
$autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoload)) {
    require_once $autoload;
    echo "<p style='color:green;'>✓ vendor/autoload.php exists</p>";
    if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
        echo "<p style='color:green;'>✓ PHPMailer class found</p>";
    } else {
        echo "<p style='color:red;'>✗ PHPMailer class NOT found</p>";
    }
} else {
    echo "<p style='color:red;'>✗ vendor/autoload.php NOT FOUND - PHPMailer is not installed!</p>";
}

// 3. Check logs directory
echo "<h3>3. Logs Directory</h3>";
$logsDir = __DIR__ . '/logs';
if (is_dir($logsDir)) {
    echo "<p style='color:green;'>✓ logs/ directory exists</p>";
    if (is_writable($logsDir)) {
        echo "<p style='color:green;'>✓ logs/ is writable</p>";
    } else {
        echo "<p style='color:red;'>✗ logs/ is NOT writable</p>";
    }
    $errorLog = $logsDir . '/error.log';
    if (file_exists($errorLog)) {
        $lines = file($errorLog);
        $recent = array_slice($lines, -10);
        echo "<p>Last 10 lines of error.log:</p>";
        echo "<pre style='background:#f5f5f5;padding:10px;font-size:12px;max-height:200px;overflow:auto;'>";
        foreach ($recent as $line) {
            echo htmlspecialchars($line);
        }
        echo "</pre>";
    } else {
        echo "<p>No error.log file yet</p>";
    }
} else {
    echo "<p style='color:red;'>✗ logs/ directory does NOT exist</p>";
}

// 4. Check database connection
echo "<h3>4. Database</h3>";
try {
    require_once __DIR__ . '/includes/config.php';
    require_once __DIR__ . '/includes/Database.php';
    $user = Database::fetchOne("SELECT id, email FROM admin_users WHERE id = 1");
    echo "<p style='color:green;'>✓ Database connected</p>";
    echo "<p>Admin email in DB: <strong>" . htmlspecialchars($user['email'] ?? 'NOT SET') . "</strong></p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>✗ Database error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

// 5. Check MailHelper.php
echo "<h3>5. MailHelper</h3>";
$mailHelper = __DIR__ . '/includes/MailHelper.php';
if (file_exists($mailHelper)) {
    echo "<p style='color:green;'>✓ MailHelper.php exists</p>";
} else {
    echo "<p style='color:red;'>✗ MailHelper.php NOT FOUND</p>";
}

// 6. Test sending email
echo "<h3>6. Test Email Send</h3>";
if (isset($_GET['send'])) {
    try {
        require_once $mailHelper;
        
        $adminEmail = $user['email'] ?? null;
        if (empty($adminEmail)) {
            echo "<p style='color:red;'>✗ No admin email to send to</p>";
        } else {
            echo "<p>Sending test email to: <strong>{$adminEmail}</strong></p>";
            
            $result = MailHelper::send(
                $adminEmail,
                'DIMA Test Email - ' . date('Y-m-d H:i:s'),
                '<h2>Test Email</h2><p>This is a test from the DIMA diagnostic script on the live server.</p>',
                'Test email from DIMA diagnostic'
            );
            
            if ($result) {
                echo "<p style='color:green;font-size:18px;'>✓ EMAIL SENT SUCCESSFULLY!</p>";
            } else {
                echo "<p style='color:red;font-size:18px;'>✗ EMAIL FAILED TO SEND</p>";
                // Check error log
                if (file_exists($errorLog)) {
                    $lines = file($errorLog);
                    $recent = array_slice($lines, -5);
                    echo "<pre style='background:#fee;padding:10px;'>";
                    foreach ($recent as $line) echo htmlspecialchars($line);
                    echo "</pre>";
                }
            }
        }
    } catch (Exception $e) {
        echo "<p style='color:red;'>✗ Exception: " . htmlspecialchars($e->getMessage()) . "</p>";
    } catch (Error $e) {
        echo "<p style='color:red;'>✗ Fatal Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
} else {
    echo "<p><a href='?send=1' style='padding:10px 20px;background:#667eea;color:white;text-decoration:none;border-radius:6px;'>Click to Send Test Email</a></p>";
}

echo "<hr><p style='color:red;font-weight:bold;'>⚠️ DELETE THIS FILE after testing!</p>";
