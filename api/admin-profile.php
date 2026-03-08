<?php
/**
 * Admin Profile Update API
 * Handles profile info update and password change
 */

// Handle CORS and preflight
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (!isset($_SESSION['admin_user_id'])) {
    APIResponse::error('Unauthorized', 401);
}

$userId = $_SESSION['admin_user_id'];

// GET — fetch current profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user = Database::fetchOne(
            "SELECT id, username, full_name, email, phone, role, last_login, created_at FROM admin_users WHERE id = ?",
            [$userId]
        );

        if (!$user) {
            APIResponse::error('User not found', 404);
        }

        APIResponse::success($user);
    } catch (Exception $e) {
        APIResponse::error('Failed to fetch profile: ' . $e->getMessage());
    }
}

// PUT or POST — update profile
if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'update_profile';

    if ($action === 'change_password') {
        // --- Password Change ---
        $currentPassword = $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';

        if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
            APIResponse::error('All password fields are required.');
        }

        if (strlen($newPassword) < 6) {
            APIResponse::error('New password must be at least 6 characters.');
        }

        if ($newPassword !== $confirmPassword) {
            APIResponse::error('New passwords do not match.');
        }

        // Verify current password
        $user = Database::fetchOne("SELECT password_hash FROM admin_users WHERE id = ?", [$userId]);
        if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
            APIResponse::error('Current password is incorrect.');
        }

        try {
            $hash = password_hash($newPassword, PASSWORD_DEFAULT);
            Database::query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [$hash, $userId]);

            // Log
            try {
                Database::insert('admin_logs', [
                    'user_id'    => $userId,
                    'action'     => 'change_password',
                    'table_name' => 'admin_users',
                    'record_id'  => $userId,
                    'ip_address' => SecurityHelper::getClientIP()
                ]);
            } catch (Exception $e) {}

            APIResponse::success(null, 'Password changed successfully.');
        } catch (Exception $e) {
            APIResponse::error('Failed to change password: ' . $e->getMessage());
        }

    } elseif ($action === 'update_email') {
        // --- Email Only Update ---
        $email = trim($input['email'] ?? '');

        if (empty($email)) {
            APIResponse::error('Email address is required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            APIResponse::error('Please enter a valid email address.');
        }

        try {
            Database::query(
                "UPDATE admin_users SET email = ? WHERE id = ?",
                [$email, $userId]
            );

            APIResponse::success(['email' => $email], 'Email updated successfully.');
        } catch (Exception $e) {
            APIResponse::error('Failed to update email: ' . $e->getMessage());
        }

    } else {
        // --- Profile Update ---
        $fullName = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');

        if (empty($email)) {
            APIResponse::error('Email address is required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            APIResponse::error('Please enter a valid email address.');
        }

        try {
            Database::query(
                "UPDATE admin_users SET full_name = ?, email = ?, phone = ? WHERE id = ?",
                [$fullName, $email, $phone, $userId]
            );

            // Log
            try {
                Database::insert('admin_logs', [
                    'user_id'    => $userId,
                    'action'     => 'update_profile',
                    'table_name' => 'admin_users',
                    'record_id'  => $userId,
                    'ip_address' => SecurityHelper::getClientIP()
                ]);
            } catch (Exception $e) {}

            // Fetch updated profile
            $user = Database::fetchOne(
                "SELECT id, username, full_name, email, phone, role, last_login, created_at FROM admin_users WHERE id = ?",
                [$userId]
            );

            APIResponse::success($user, 'Profile updated successfully.');
        } catch (Exception $e) {
            APIResponse::error('Failed to update profile: ' . $e->getMessage());
        }
    }
}

APIResponse::error('Method not allowed', 405);
