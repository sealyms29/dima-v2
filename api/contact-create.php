<?php
/**
 * POST /api/contact/create
 * 
 * Create a contact form submission
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/NotificationHelper.php';
require_once __DIR__ . '/../includes/MailHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

$input = json_decode(file_get_contents('php://input'), true);

$errors = [];

// Validate inputs
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
    $errors['phone'] = 'Phone is required';
} elseif (!SecurityHelper::validatePhone($phone)) {
    $errors['phone'] = 'Invalid phone number';
}

$company = SecurityHelper::sanitizeString($input['company'] ?? '');
if (!empty($company) && strlen($company) > 255) {
    $errors['company'] = 'Company must not exceed 255 characters';
}

$message = SecurityHelper::sanitizeString($input['message'] ?? '');
if (empty($message)) {
    $errors['message'] = 'Message is required';
} elseif (strlen($message) > 5000) {
    $errors['message'] = 'Message must not exceed 5000 characters';
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

    $contact_id = Database::insert('contacts', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'company' => $company,
        'message' => $message,
        'status' => 'new'
    ]);

    log_activity('create', 'contacts', $contact_id, null, json_encode([
        'name' => $name,
        'email' => $email
    ]));

    DBTransaction::commit();

    // Create admin notification
    create_notification('contact', $contact_id, $name, $email);

    // Send email notification to admin
    try {
        MailHelper::sendSubmissionNotification('contact', [
            'Name' => $name,
            'Email' => $email,
            'Phone' => $phone,
            'Company' => $company,
            'Message' => $message
        ]);
    } catch (Exception $mailError) {
        error_log('Failed to send contact notification email: ' . $mailError->getMessage());
    }

    APIResponse::send(APIResponse::success(
        ['id' => $contact_id],
        'Contact form submitted successfully. We will get back to you soon.',
        201
    ));

} catch (Exception $e) {
    DBTransaction::rollback();
    error_log('Contact creation error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to submit contact form', 500));
}
