<?php
/**
 * Public API - Get Quotation Documents
 * Returns active application forms & questionnaires per programme
 */
require_once __DIR__ . '/../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(APIResponse::error('Method not allowed', 405));
    exit;
}

try {
    $docs = Database::fetchAll(
        "SELECT programme, doc_type, title, file_path 
         FROM quotation_documents 
         WHERE status = 'Active' 
         ORDER BY FIELD(programme, 'MSPO','ISO9001','ISO14001','ISO45001'), FIELD(doc_type, 'Application Form','Questionnaire')"
    );

    // Group by programme
    $grouped = [];
    foreach ($docs as $doc) {
        $key = $doc['programme'];
        if (!isset($grouped[$key])) {
            $grouped[$key] = [];
        }
        // Use doc_type as key for easy lookup
        $typeKey = $doc['doc_type'] === 'Application Form' ? 'application_form' : 'questionnaire';
        $grouped[$key][$typeKey] = [
            'title'     => $doc['title'],
            'file_path' => $doc['file_path']
        ];
    }

    echo json_encode(APIResponse::success($grouped));
} catch (Exception $e) {
    error_log('Public quotation docs error: ' . $e->getMessage());
    echo json_encode(APIResponse::error('Failed to load documents', 500));
}
