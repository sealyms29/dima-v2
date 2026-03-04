<?php
/**
 * POST /api/quotation/create
 * 
 * Create a quotation submission
 * 
 * Request body (JSON):
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "+60123456789",
 *   "company": "ABC Corp",
 *   "message": "I'm interested in ISO 9001 certification"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Quotation submitted successfully",
 *   "data": { "id": 123 }
 * }
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/NotificationHelper.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Get and decode JSON input
$input = json_decode(file_get_contents('php://input'), true);

// ============================================================================
// VALIDATION
// ============================================================================

$errors = [];

// Name validation
$name = $input['name'] ?? '';
$name = SecurityHelper::sanitizeString($name);
if (empty($name)) {
    $errors['name'] = 'Name is required';
} elseif (strlen($name) < 2 || strlen($name) > 255) {
    $errors['name'] = 'Name must be between 2 and 255 characters';
}

// Email validation
$email = $input['email'] ?? '';
$email = SecurityHelper::sanitizeString($email);
if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!SecurityHelper::validateEmail($email)) {
    $errors['email'] = 'Invalid email format';
}

// Phone validation
$phone = $input['phone'] ?? '';
$phone = SecurityHelper::sanitizeString($phone);
if (empty($phone)) {
    $errors['phone'] = 'Phone number is required';
} elseif (!SecurityHelper::validatePhone($phone)) {
    $errors['phone'] = 'Invalid phone number format';
}

// Company (optional but sanitize)
$company = $input['company'] ?? '';
$company = SecurityHelper::sanitizeString($company);
if (!empty($company) && strlen($company) > 255) {
    $errors['company'] = 'Company name must not exceed 255 characters';
}

// Message validation
$message = $input['message'] ?? '';
$message = SecurityHelper::sanitizeString($message);
if (empty($message)) {
    $errors['message'] = 'Message is required';
} elseif (strlen($message) < 10 || strlen($message) > 5000) {
    $errors['message'] = 'Message must be between 10 and 5000 characters';
}

// If validation fails, return errors
if (!empty($errors)) {
    APIResponse::send(APIResponse::validation($errors));
}

// ============================================================================
// RATE LIMITING
// ============================================================================

$client_ip = SecurityHelper::getClientIP();
if (!SecurityHelper::checkRateLimit($client_ip, API_RATE_LIMIT)) {
    APIResponse::send(APIResponse::error('Too many requests. Please try again later.', 429));
}

// ============================================================================
// INSERT INTO DATABASE
// ============================================================================

try {
    DBTransaction::begin();

    $quotation_id = Database::insert('quotations', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'company' => $company,
        'message' => $message,
        'status' => 'new'
    ]);

    // Log the submission
    log_activity('create', 'quotations', $quotation_id, null, json_encode([
        'name' => $name,
        'email' => $email
    ]));

    DBTransaction::commit();

    // Create admin notification
    create_notification('quotation', $quotation_id, $name, $email);

    // ========================================================================
    // OPTIONAL: Send Email Notification
    // ========================================================================
    
    if (SEND_EMAIL_NOTIFICATIONS) {
        send_quotation_notification($name, $email, $company, $message);
    }

    // Return success response
    APIResponse::send(APIResponse::success(
        ['id' => $quotation_id],
        'Quotation submitted successfully. We will contact you soon.',
        201
    ));

} catch (Exception $e) {
    DBTransaction::rollback();
    error_log('Quotation creation error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to submit quotation', 500));
}

// log_activity() is defined in bootstrap.php
