<?php
/**
 * POST /api/complaint/create
 * 
 * Create a complaint/appeal submission
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/NotificationHelper.php';
require_once __DIR__ . '/../includes/MailHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Support both JSON and multipart/form-data
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
} else {
    $input = $_POST;
}

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

// Evidence file uploads (optional)
$evidencePaths = [];
$allowedMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
$maxFileSize = 10 * 1024 * 1024; // 10MB
$uploadDir = __DIR__ . '/../uploads/evidence/';

if (!empty($_FILES['evidence_files']['name'][0])) {
    // Create directory if missing
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileCount = count($_FILES['evidence_files']['name']);
    if ($fileCount > 5) {
        $errors['evidence'] = 'Maximum 5 files allowed';
    } else {
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['evidence_files']['error'][$i] !== UPLOAD_ERR_OK) {
                $errors['evidence'] = 'One or more files failed to upload';
                break;
            }
            $tmpName = $_FILES['evidence_files']['tmp_name'][$i];
            $origName = $_FILES['evidence_files']['name'][$i];
            $size = $_FILES['evidence_files']['size'][$i];
            $mime = mime_content_type($tmpName);

            if (!in_array($mime, $allowedMime)) {
                $errors['evidence'] = 'Only PDF, JPG, PNG, and WEBP files are allowed';
                break;
            }
            if ($size > $maxFileSize) {
                $errors['evidence'] = 'Each file must be under 10MB';
                break;
            }

            $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
            $safeName = uniqid('ev_', true) . '.' . $ext;
            $destPath = $uploadDir . $safeName;

            if (!move_uploaded_file($tmpName, $destPath)) {
                $errors['evidence'] = 'Failed to save uploaded file';
                break;
            }
            $evidencePaths[] = 'uploads/evidence/' . $safeName;
        }
    }
}

if (!empty($errors)) {
    // Clean up any already-uploaded files on validation failure
    foreach ($evidencePaths as $p) {
        $full = __DIR__ . '/../' . $p;
        if (file_exists($full)) unlink($full);
    }
    APIResponse::send(APIResponse::validation($errors));
}

// Build evidence value: JSON array of paths or null
$evidenceValue = !empty($evidencePaths) ? json_encode($evidencePaths) : null;

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
        'evidence' => $evidenceValue,
        'status' => 'new',
        'priority' => 'medium'
    ]);

    log_activity('create', 'complaints', $complaint_id, null, json_encode([
        'type' => $complaint_type,
        'programme' => $programme,
        'email' => $email
    ]));

    DBTransaction::commit();

    // Create admin notification (use complaint_type to distinguish complaint vs appeal)
    create_notification($complaint_type, $complaint_id, $name, $email);

    // Send email notification to admin
    try {
        $programmeLabel = $programme === 'iso' ? "ISO {$iso_standard}" : 'MSPO';
        MailHelper::sendSubmissionNotification('complaint', [
            'Type' => ucfirst($complaint_type),
            'Programme' => $programmeLabel,
            'Name' => $name,
            'Email' => $email,
            'Phone' => $phone,
            'Organization' => $organization,
            'Description' => $description
        ]);
    } catch (Exception $mailError) {
        error_log('Failed to send complaint notification email: ' . $mailError->getMessage());
    }

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
