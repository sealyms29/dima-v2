<?php
/**
 * Admin Logout Page
 */

require_once __DIR__ . '/../includes/config.php';

// Start session to destroy it
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Clear session
session_destroy();

// Redirect to login
header('Location: ' . BASE_PATH . '/admin/login.php');
