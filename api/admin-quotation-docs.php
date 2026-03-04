<?php
/**
 * Admin API - Manage Quotation Documents (Application Forms & Questionnaires)
 * GET:    List all quotation documents
 * POST:   Upload / replace a document (programme + doc_type must be set)
 * DELETE: Remove a document by id
 */
require_once __DIR__ . '/../includes/bootstrap.php';

// Auth check
if (!isset($_SESSION['admin_user_id'])) {
    echo json_encode(APIResponse::error('Unauthorized', 401));
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

$PROGRAMMES = ['MSPO', 'ISO9001', 'ISO14001', 'ISO45001'];
$DOC_TYPES  = ['Application Form', 'Questionnaire'];
$UPLOAD_DIR = __DIR__ . '/../uploads/quotation-forms/';

// Ensure upload directory exists
if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0755, true);
}

// ─── GET: list all quotation documents ───────────────────────
if ($method === 'GET') {
    try {
        $docs = Database::fetchAll(
            "SELECT * FROM quotation_documents ORDER BY FIELD(programme, 'MSPO','ISO9001','ISO14001','ISO45001'), FIELD(doc_type, 'Application Form','Questionnaire')"
        );
        echo json_encode(APIResponse::success($docs));
    } catch (Exception $e) {
        error_log('Quotation docs GET error: ' . $e->getMessage());
        echo json_encode(APIResponse::error('Failed to load documents', 500));
    }
    exit;
}

// ─── POST: upload or replace a document ──────────────────────
if ($method === 'POST') {
    $programme = $_POST['programme'] ?? '';
    $doc_type  = $_POST['doc_type'] ?? '';
    $title     = trim($_POST['title'] ?? '');

    // Validate
    if (!in_array($programme, $PROGRAMMES)) {
        echo json_encode(APIResponse::error('Invalid programme'));
        exit;
    }
    if (!in_array($doc_type, $DOC_TYPES)) {
        echo json_encode(APIResponse::error('Invalid document type'));
        exit;
    }
    if (empty($title)) {
        echo json_encode(APIResponse::error('Title is required'));
        exit;
    }

    // Check file
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(APIResponse::error('PDF file is required'));
        exit;
    }

    $file = $_FILES['file'];

    // Validate PDF
    if ($file['size'] > 10 * 1024 * 1024) {
        echo json_encode(APIResponse::error('File too large. Maximum 10MB'));
        exit;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if ($mime !== 'application/pdf') {
        echo json_encode(APIResponse::error('Only PDF files are allowed'));
        exit;
    }

    // Generate filename
    $safeName = strtolower(str_replace(' ', '-', $programme)) . '_' . strtolower(str_replace(' ', '-', $doc_type));
    $filename = $safeName . '_' . time() . '.pdf';
    $filepath = $UPLOAD_DIR . $filename;
    $webPath  = BASE_PATH . '/uploads/quotation-forms/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode(APIResponse::error('Failed to save file'));
        exit;
    }

    try {
        // Check if one already exists for this programme + doc_type
        $existing = Database::fetchOne(
            "SELECT * FROM quotation_documents WHERE programme = ? AND doc_type = ?",
            [$programme, $doc_type]
        );

        if ($existing) {
            // Delete old file
            $oldFile = __DIR__ . '/..' . $existing['file_path'];
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }

            // Update record
            Database::query(
                "UPDATE quotation_documents SET title = ?, file_path = ?, file_size = ? WHERE id = ?",
                [$title, $webPath, $file['size'], $existing['id']]
            );

            echo json_encode(APIResponse::success(null, 'Document replaced successfully'));
        } else {
            // Insert new
            Database::insert('quotation_documents', [
                'programme' => $programme,
                'doc_type'  => $doc_type,
                'title'     => $title,
                'file_path' => $webPath,
                'file_size' => $file['size'],
                'status'    => 'Active'
            ]);

            echo json_encode(APIResponse::success(null, 'Document uploaded successfully'));
        }
    } catch (Exception $e) {
        error_log('Quotation doc upload error: ' . $e->getMessage());
        // Clean up uploaded file on error
        if (file_exists($filepath)) unlink($filepath);
        echo json_encode(APIResponse::error('Database error', 500));
    }
    exit;
}

// ─── DELETE: remove a document ───────────────────────────────
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        echo json_encode(APIResponse::error('Document ID is required'));
        exit;
    }

    try {
        $doc = Database::fetchOne("SELECT * FROM quotation_documents WHERE id = ?", [$id]);
        if (!$doc) {
            echo json_encode(APIResponse::error('Document not found', 404));
            exit;
        }

        // Delete file
        $filePath = __DIR__ . '/..' . $doc['file_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        Database::delete('quotation_documents', 'id', $id);
        echo json_encode(APIResponse::success(null, 'Document deleted successfully'));
    } catch (Exception $e) {
        error_log('Quotation doc delete error: ' . $e->getMessage());
        echo json_encode(APIResponse::error('Delete failed', 500));
    }
    exit;
}

echo json_encode(APIResponse::error('Method not allowed', 405));
