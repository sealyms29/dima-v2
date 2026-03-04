<?php
/**
 * Replace Document File Handler
 * POST /api/admin-documents-replace.php
 * 
 * Replaces PDF file for an existing document
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
    if (!isset($_POST['id']) || !isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(APIResponse::error('Document ID and file are required', 400));
        exit;
    }

    $doc_id = intval($_POST['id']);
    $document = DocumentsManager::replaceDocumentFile($doc_id, $_FILES['file']);

    // Log activity
    log_activity('replace_file', 'documents', $doc_id, null, json_encode($document));

    http_response_code(200);
    echo json_encode(APIResponse::success($document, 'Document file replaced successfully', 200));

} catch (Exception $e) {
    error_log('Document file replacement error: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(APIResponse::error($e->getMessage(), 400));
}
