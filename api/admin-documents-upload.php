<?php
/**
 * Document File Upload Handler
 * POST /api/admin-documents-upload.php
 * 
 * Uploads new PDF document and creates record in documents table
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/DocumentsManager.php';

// Authentication check  
if (!isset($_SESSION['admin_user_id'])) {
    http_response_code(401);
    echo json_encode(APIResponse::error('Unauthorized', 401));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(APIResponse::error('Method not allowed', 405));
    exit;
}

try {
    // Validate required fields
    if (!isset($_FILES['file']) || empty($_FILES['file']['tmp_name'])) {
        http_response_code(400);
        echo json_encode(APIResponse::error('No file uploaded', 400));
        exit;
    }

    if (empty($_POST['title'])) {
        http_response_code(400);
        echo json_encode(APIResponse::error('Document title is required', 400));
        exit;
    }

    $title = SecurityHelper::sanitizeString($_POST['title']);
    $description = SecurityHelper::sanitizeString($_POST['description'] ?? '');
    $category = $_POST['category'] ?? '';
    $year = $_POST['year'] ?? '';
    $month = $_POST['month'] ?? '';
    $audit_status = $_POST['audit_status'] ?? '';

    // Validate file
    $file_errors = DocumentsManager::validateUploadedFile($_FILES['file']);
    if (!empty($file_errors)) {
        http_response_code(400);
        echo json_encode(APIResponse::error('File validation failed: ' . implode(', ', $file_errors), 400));
        exit;
    }

    // Save file
    $file_info = DocumentsManager::saveUploadedFile($_FILES['file']);

    // Create document record
    $doc_data = [
        'title' => $title,
        'description' => $description,
        'category' => $category,
        'type' => 'PDF',
        'status' => 'Active',
        'year' => $year,
        'month' => $month,
        'file_path' => $file_info['path'],
        'file_size' => $file_info['size'],
        'mime_type' => $file_info['mime']
    ];

    // Only include audit_status for notifications
    if ($category === 'MSPO Public Notifications' && !empty($audit_status)) {
        $doc_data['audit_status'] = $audit_status;
    }

    $doc_id = DocumentsManager::createDocument($doc_data);
    $document = DocumentsManager::getDocumentById($doc_id);

    // Log activity
    log_activity('upload_document', 'documents', $doc_id, null, json_encode($document));

    http_response_code(201);
    echo json_encode(APIResponse::success($document, 'Document uploaded successfully', 201));

} catch (Exception $e) {
    error_log('Document upload error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(APIResponse::error('File upload failed: ' . $e->getMessage(), 500));
}
