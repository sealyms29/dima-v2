<?php
/**
 * Admin Documents Management API
 * 
 * GET    /api/admin-documents.php - List all documents with filters
 * POST   /api/admin-documents.php - Create new document
 * PATCH  /api/admin-documents.php - Update document
 * DELETE /api/admin-documents.php - Delete document
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/DocumentsManager.php';

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    http_response_code(401);
    echo json_encode(APIResponse::error('Unauthorized', 401));
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    handleListDocuments();
} elseif ($method === 'POST') {
    handleCreateDocument();
} elseif ($method === 'PATCH') {
    handleUpdateDocument();
} elseif ($method === 'DELETE') {
    handleDeleteDocument();
} else {
    http_response_code(405);
    echo json_encode(APIResponse::error('Method not allowed', 405));
}

function handleListDocuments() {
    try {
        $filters = [];
        
        if (!empty($_GET['category'])) {
            $category = sanitizeString($_GET['category']);
            if (DocumentsManager::isValidCategory($category)) {
                $filters['category'] = $category;
            }
        }

        if (!empty($_GET['status'])) {
            $status = sanitizeString($_GET['status']);
            if (DocumentsManager::isValidStatus($status)) {
                $filters['status'] = $status;
            }
        }

        if (!empty($_GET['year'])) {
            $filters['year'] = intval($_GET['year']);
        }

        if (!empty($_GET['id'])) {
            $filters['id'] = intval($_GET['id']);
        }

        $documents = DocumentsManager::getDocuments($filters);

        foreach ($documents as &$doc) {
            foreach ($doc as $key => &$value) {
                if (is_string($value)) {
                    $value = SecurityHelper::escapeHTML($value);
                }
            }
        }

        http_response_code(200);
        echo json_encode(APIResponse::success($documents, 'Documents retrieved', 200));

    } catch (Exception $e) {
        error_log('List documents error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(APIResponse::error('Failed to retrieve documents', 500));
    }
}

function handleCreateDocument() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['title'])) {
            http_response_code(400);
            echo json_encode(APIResponse::error('Title is required', 400));
            return;
        }

        $id = DocumentsManager::createDocument($input);
        $document = DocumentsManager::getDocumentById($id);

        http_response_code(201);
        echo json_encode(APIResponse::success($document, 'Document created', 201));

    } catch (Exception $e) {
        error_log('Create document error: ' . $e->getMessage());
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}

function handleUpdateDocument() {
    try {
        // Parse multipart form data or URL-encoded data
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            // FormData sent from JS
            $_PATCH = $_POST;
        } else {
            parse_str(file_get_contents('php://input'), $_PATCH);
        }
        
        $id = $_PATCH['id'] ?? null;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(APIResponse::error('Document ID is required', 400));
            return;
        }

        $document = DocumentsManager::updateDocument(intval($id), $_PATCH);

        http_response_code(200);
        echo json_encode(APIResponse::success($document, 'Document updated', 200));

    } catch (Exception $e) {
        error_log('Update document error: ' . $e->getMessage());
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}

function handleDeleteDocument() {
    try {
        $id = $_GET['id'] ?? null;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(APIResponse::error('Document ID is required', 400));
            return;
        }

        DocumentsManager::deleteDocument(intval($id));

        http_response_code(200);
        echo json_encode(APIResponse::success(null, 'Document deleted', 200));

    } catch (Exception $e) {
        error_log('Delete document error: ' . $e->getMessage());
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}

function sanitizeString($str) {
    return SecurityHelper::sanitizeString($str);
}
