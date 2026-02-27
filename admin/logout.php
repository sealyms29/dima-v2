<?php
/**
 * Admin Logout Page
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Clear session
session_destroy();

// Redirect to dashboard (will redirect to login)
header('Location: /admin/');
exit;
