<?php
/**
 * Mail Helper - Send emails using PHPMailer
 */

require_once __DIR__ . '/mail-config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class MailHelper {

    /**
     * Send a password reset email
     */
    public static function sendPasswordResetEmail(string $toEmail, string $username, string $resetToken): bool {
        $resetUrl = APP_BASE_URL . '/admin/reset-password.php?token=' . urlencode($resetToken);

        $subject = 'Password Reset - DIMA Admin';
        $body = self::getResetEmailHtml($username, $resetUrl);
        $altBody = "Hi $username,\n\nYou requested a password reset.\n\nClick this link to reset your password:\n$resetUrl\n\nThis link expires in " . RESET_TOKEN_EXPIRY . " minutes.\n\nIf you did not request this, please ignore this email.\n\n- DIMA Certification";

        return self::send($toEmail, $subject, $body, $altBody);
    }

    /**
     * Send an email
     */
    public static function send(string $to, string $subject, string $htmlBody, string $altBody = ''): bool {
        $mail = new PHPMailer(true);

        try {
            // Check if SMTP is configured
            if (empty(MAIL_USERNAME) || empty(MAIL_PASSWORD)) {
                error_log('[MailHelper] Mail not configured: MAIL_USERNAME or MAIL_PASSWORD is empty in mail-config.php');
                return false;
            }

            // SMTP settings
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USERNAME;
            $mail->Password   = MAIL_PASSWORD;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = MAIL_PORT;

            // Sender & recipient
            $mail->setFrom(MAIL_FROM ?: MAIL_USERNAME, MAIL_FROM_NAME);
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = $altBody;

            $mail->send();
            error_log("[MailHelper] Mail sent successfully to {$to} (subject: {$subject})");
            return true;

        } catch (Exception $e) {
            error_log('[MailHelper] Mail send error: ' . $mail->ErrorInfo . ' Exception: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate HTML email template for password reset
     */
    private static function getResetEmailHtml(string $username, string $resetUrl): string {
        $expiry = RESET_TOKEN_EXPIRY;
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:520px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px 32px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">DIMA Certification</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Password Reset Request</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
            <p style="color:#333;font-size:15px;margin:0 0 16px;">Hi <strong>{$username}</strong>,</p>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
                We received a request to reset your admin password. Click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:28px 0;">
                <a href="{$resetUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
                    Reset My Password
                </a>
            </div>

            <p style="color:#888;font-size:13px;line-height:1.5;margin:0 0 16px;">
                This link will expire in <strong>{$expiry} minutes</strong>. If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

            <p style="color:#aaa;font-size:12px;margin:0;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <a href="{$resetUrl}" style="color:#667eea;word-break:break-all;">{$resetUrl}</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;margin:0;">© DIMA Certification Sdn Bhd</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Send notification email to admin for new submissions
     */
    public static function sendSubmissionNotification(string $type, array $data): bool {
        // Get admin email from settings
        if (!function_exists('get_admin_email')) {
            require_once __DIR__ . '/Database.php';
            require_once __DIR__ . '/config.php';
            try {
                $result = Database::fetchOne(
                    "SELECT setting_value FROM site_settings WHERE setting_key = 'email_1' AND setting_group = 'contact'"
                );
                $adminEmail = $result['setting_value'] ?? null;
            } catch (Exception $e) {
                error_log('[MailHelper] Failed to get admin email: ' . $e->getMessage());
                return false;
            }
        } else {
            $adminEmail = get_admin_email();
        }

        if (empty($adminEmail)) {
            error_log('[MailHelper] Admin email not configured in admin_users');
            return false;
        }

        $typeLabels = [
            'quotation' => 'Quotation Request',
            'feedback' => 'Feedback',
            'complaint' => 'Complaint',
            'contact' => 'Contact Message'
        ];

        $typeLabel = $typeLabels[$type] ?? 'Submission';
        $subject = "New {$typeLabel} - DIMA Website";

        $body = self::getSubmissionEmailHtml($typeLabel, $data);
        $altBody = self::getSubmissionEmailText($typeLabel, $data);

        // Debug log: attempt
        error_log("[MailHelper] Attempting to send submission notification: type={$typeLabel}, recipient={$adminEmail}");

        $result = self::send($adminEmail, $subject, $body, $altBody);
        if ($result) {
            error_log("[MailHelper] Submission notification sent successfully to {$adminEmail}.");
        } else {
            error_log("[MailHelper] Submission notification FAILED to send to {$adminEmail}.");
        }
        return $result;
    }

    /**
     * Generate HTML email for submission notifications
     */
    private static function getSubmissionEmailHtml(string $typeLabel, array $data): string {
        $rows = '';
        foreach ($data as $key => $value) {
            $label = ucwords(str_replace('_', ' ', $key));
            $value = htmlspecialchars($value ?? '');
            $rows .= "<tr><td style=\"padding:10px 16px;border-bottom:1px solid #eee;font-weight:600;color:#555;width:140px;\">{$label}</td><td style=\"padding:10px 16px;border-bottom:1px solid #eee;color:#333;\">{$value}</td></tr>";
        }

        $adminUrl = defined('APP_URL') ? APP_URL . '/admin/submissions.php' : '#';

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#d4af37,#b8962e);padding:30px 32px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">DIMA Certification</h1>
            <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">New {$typeLabel}</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
            <p style="color:#333;font-size:15px;margin:0 0 24px;">
                You have received a new <strong>{$typeLabel}</strong> from the DIMA website.
            </p>

            <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:8px;overflow:hidden;">
                {$rows}
            </table>

            <div style="text-align:center;margin:28px 0;">
                <a href="{$adminUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#d4af37,#b8962e);color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
                    View in Admin Panel
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;margin:0;">© DIMA Certification Sdn Bhd</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Generate plain text email for submission notifications
     */
    private static function getSubmissionEmailText(string $typeLabel, array $data): string {
        $adminUrl = defined('APP_URL') ? APP_URL . '/admin/submissions.php' : '';
        
        $text = "New {$typeLabel} - DIMA Website\n\n";
        $text .= "You have received a new {$typeLabel} from the DIMA website.\n\n";
        $text .= "Details:\n";
        $text .= str_repeat('-', 40) . "\n";
        
        foreach ($data as $key => $value) {
            $label = ucwords(str_replace('_', ' ', $key));
            $text .= "{$label}: {$value}\n";
        }
        
        $text .= str_repeat('-', 40) . "\n\n";
        if ($adminUrl) {
            $text .= "View in Admin Panel: {$adminUrl}\n\n";
        }
        $text .= "- DIMA Certification";
        
        return $text;
    }
}
