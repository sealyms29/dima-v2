<?php
/**
 * POST /api/complaint/create
 * 
 * Create a complaint/appeal submission
 */

require_once __DIR__ . '/../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

$input = json_decode(file_get_contents('php://input'), true);

$errors = [];

// Complaint type
$complaint_type = $input['complaint_type'] ?? 'complaint';
if (!in_array($complaint_type, ['complaint', 'appeal'])) {
    $errors['complaint_type'] = 'Invalid complaint type';
}

// Programme
$programme = $input['programme'] ?? '';
if (!in_array($programme, ['iso', 'mspo'])) {
    $errors['programme'] = 'Please select a programme';
}

// ISO Standard (if ISO is selected)
$iso_standard = null;
if ($programme === 'iso') {
    $iso_standard = $input['iso_standard'] ?? '';
    if (!in_array($iso_standard, ['9001', '14001', '45001'])) {
        $errors['iso_standard'] = 'Invalid ISO standard';
    }
}

// Name
$name = SecurityHelper::sanitizeString($input['name'] ?? '');
if (empty($name)) {
    $errors['name'] = 'Name is required';
} elseif (strlen($name) > 255) {
    $errors['name'] = 'Name must not exceed 255 characters';
}

// Email
$email = SecurityHelper::sanitizeString($input['email'] ?? '');
if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!SecurityHelper::validateEmail($email)) {
    $errors['email'] = 'Invalid email format';
}

// Phone
$phone = SecurityHelper::sanitizeString($input['phone'] ?? '');
if (empty($phone)) {
    $errors['phone'] = 'Phone is required';
} elseif (!SecurityHelper::validatePhone($phone)) {
    $errors['phone'] = 'Invalid phone number';
}

// Organization
$organization = SecurityHelper::sanitizeString($input['organization'] ?? '');
if (!empty($organization) && strlen($organization) > 255) {
    $errors['organization'] = 'Organization must not exceed 255 characters';
}

// Description
$description = SecurityHelper::sanitizeString($input['description'] ?? '');
if (empty($description)) {
    $errors['description'] = 'Description is required';
} elseif (strlen($description) < 20 || strlen($description) > 5000) {
    $errors['description'] = 'Description must be between 20 and 5000 characters';
}

// Evidence (optional)
$evidence = SecurityHelper::sanitizeString($input['evidence'] ?? '');
if (!empty($evidence) && strlen($evidence) > 5000) {
    $errors['evidence'] = 'Evidence must not exceed 5000 characters';
}

if (!empty($errors)) {
    APIResponse::send(APIResponse::validation($errors));
}

// Rate limiting
$client_ip = SecurityHelper::getClientIP();
if (!SecurityHelper::checkRateLimit($client_ip, 50)) { // Stricter limit for complaints
    APIResponse::send(APIResponse::error('Too many submissions. Please try again later.', 429));
}

try {
    DBTransaction::begin();

    $complaint_id = Database::insert('complaints', [
        'complaint_type' => $complaint_type,
        'programme' => $programme,
        'iso_standard' => $iso_standard,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'organization' => $organization,
        'description' => $description,
        'evidence' => !empty($evidence) ? $evidence : null,
        'status' => 'new',
        'priority' => 'medium'
    ]);

    log_activity('create', 'complaints', $complaint_id, null, json_encode([
        'type' => $complaint_type,
        'programme' => $programme,
        'email' => $email
    ]));

    DBTransaction::commit();

    APIResponse::send(APIResponse::success(
        ['id' => $complaint_id],
        'Your ' . $complaint_type . ' has been submitted successfully. Our team will review it and contact you shortly.',
        201
    ));

} catch (Exception $e) {
    DBTransaction::rollback();
    error_log('Complaint creation error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to submit complaint', 500));
}

function log_activity($action, $table_name, $record_id, $old_value = null, $new_value = null) {
    try {
        Database::insert('admin_logs', [
            'user_id' => $_SESSION['admin_user_id'] ?? null,
            'action' => $action,
            'table_name' => $table_name,
            'record_id' => $record_id,
            'old_value' => $old_value,
            'new_value' => $new_value,
            'ip_address' => SecurityHelper::getClientIP()
        ]);
    } catch (Exception $e) {
        error_log('Failed to log activity: ' . $e->getMessage());
    }
}
