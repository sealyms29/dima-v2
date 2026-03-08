<?php
/**
 * Public Certification Agreement API
 * GET /api/public-certification-agreement.php
 * 
 * Returns certification agreement info including PDF download path
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $agreement = Database::fetchOne("SELECT title, description, file_path, file_name, file_size, version, issue_date, updated_at FROM certification_agreement WHERE id = 1");
    
    if (!$agreement) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Agreement not found']);
        exit;
    }
    
    $result = [
        'title' => $agreement['title'],
        'description' => $agreement['description'],
        'file_path' => $agreement['file_path'],
        'file_name' => $agreement['file_name'],
        'file_size' => $agreement['file_size'] ? (int)$agreement['file_size'] : null,
        'version' => $agreement['version'],
        'issue_date' => $agreement['issue_date'],
        'has_pdf' => !empty($agreement['file_path']),
        'updated_at' => $agreement['updated_at']
    ];
    
    echo json_encode(['success' => true, 'data' => $result]);
    
} catch (Exception $e) {
    error_log('Certification agreement API error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to retrieve agreement']);
}
