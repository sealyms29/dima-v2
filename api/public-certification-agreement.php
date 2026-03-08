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
    // Try documents table first (new unified system)
    $doc = Database::fetchOne("SELECT id, title, description, file_path, status, created_at, updated_at FROM documents WHERE (category = 'Certification Agreement' OR category = 'Certification Terms and Conditions') ORDER BY updated_at DESC LIMIT 1");
    
    if ($doc) {
        $result = [
            'title' => $doc['title'],
            'description' => $doc['description'] ?? 'DMC/ISO/QCA Quotation Certification Agreement',
            'file_path' => $doc['file_path'],
            'file_name' => basename($doc['file_path']),
            'file_size' => null,
            'version' => '1.0',
            'issue_date' => $doc['created_at'],
            'has_pdf' => !empty($doc['file_path']),
            'updated_at' => $doc['updated_at']
        ];
        echo json_encode(['success' => true, 'data' => $result]);
        exit;
    }
    
    // Fallback to legacy certification_agreement table
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
