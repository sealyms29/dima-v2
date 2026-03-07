<?php
/**
 * POST /api/feedback-create.php
 * 
 * Create a feedback form submission
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/NotificationHelper.php';

// Auto-create feedback_messages table if it doesn't exist
try {
    Database::query("CREATE TABLE IF NOT EXISTS feedback_messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        feedback_type VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service_type VARCHAR(255) DEFAULT NULL,
        comment TEXT NOT NULL,
        status ENUM('new', 'read', 'responded', 'archived') DEFAULT 'new',
        notes TEXT DEFAULT NULL,
        responded_by INT UNSIGNED DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_feedback_type (feedback_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) {
    // Table likely already exists, continue
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

$input = json_decode(file_get_contents('php://input'), true);

$errors = [];

// Validate inputs
$feedback_type = SecurityHelper::sanitizeString($input['feedback_type'] ?? '');
if (empty($feedback_type)) {
    $errors['feedback_type'] = 'Type of feedback is required';
} elseif (!in_array($feedback_type, ['General Feedback', 'Suggestion', 'Service Inquiry', 'Other'])) {
    $errors['feedback_type'] = 'Invalid feedback type';
}

$name = SecurityHelper::sanitizeString($input['name'] ?? '');
if (empty($name)) {
    $errors['name'] = 'Name is required';
} elseif (strlen($name) > 255) {
    $errors['name'] = 'Name must not exceed 255 characters';
}

$email = SecurityHelper::sanitizeString($input['email'] ?? '');
if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!SecurityHelper::validateEmail($email)) {
    $errors['email'] = 'Invalid email format';
}

$phone = SecurityHelper::sanitizeString($input['phone'] ?? '');
if (empty($phone)) {
    $errors['phone'] = 'Phone number is required';
} elseif (!SecurityHelper::validatePhone($phone)) {
    $errors['phone'] = 'Invalid phone number';
}

$service_type = SecurityHelper::sanitizeString($input['service_type'] ?? '');
if (empty($service_type)) {
    $errors['service_type'] = 'Service type is required';
} elseif (strlen($service_type) > 255) {
    $errors['service_type'] = 'Service type must not exceed 255 characters';
}

$comment = SecurityHelper::sanitizeString($input['comment'] ?? '');
if (empty($comment)) {
    $errors['comment'] = 'Comment is required';
} elseif (strlen($comment) > 5000) {
    $errors['comment'] = 'Comment must not exceed 5000 characters';
}

if (!empty($errors)) {
    APIResponse::send(APIResponse::validation($errors));
}

// Rate limiting
$client_ip = SecurityHelper::getClientIP();
if (!SecurityHelper::checkRateLimit($client_ip, API_RATE_LIMIT)) {
    APIResponse::send(APIResponse::error('Too many requests', 429));
}

try {
    DBTransaction::begin();

    $feedback_id = Database::insert('feedback_messages', [
        'feedback_type' => $feedback_type,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'service_type' => $service_type,
        'comment' => $comment,
        'status' => 'new'
    ]);

    log_activity('create', 'feedback_messages', $feedback_id, null, json_encode([
        'name' => $name,
        'email' => $email,
        'feedback_type' => $feedback_type
    ]));

    // Create notification for admin
    create_notification('feedback', $feedback_id, $name, $email);

    DBTransaction::commit();

    APIResponse::send(APIResponse::success([
        'id' => $feedback_id,
        'message' => 'Feedback submitted successfully'
    ]));
} catch (Exception $e) {
    DBTransaction::rollback();
    error_log('Feedback submission error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to submit feedback. Please try again.', 500));
}
