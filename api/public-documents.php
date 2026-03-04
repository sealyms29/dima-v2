<?php
/**
 * Public Documents API (no auth required)
 * GET /api/public-documents.php?category=MSPO+Public+Notifications
 * GET /api/public-documents.php?category=MSPO+Public+Report+Summary
 * GET /api/public-documents.php?category=MSPO+Public+Report+Summary&year=2025
 * 
 * Returns active documents grouped by year and month
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/DocumentsManager.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $filters = ['status' => 'Active'];

    if (!empty($_GET['category'])) {
        $category = $_GET['category'];
        if (DocumentsManager::isValidCategory($category)) {
            $filters['category'] = $category;
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid category']);
            exit;
        }
    }

    if (!empty($_GET['year'])) {
        $filters['year'] = intval($_GET['year']);
    }

    $documents = DocumentsManager::getDocuments($filters);

    // Build clean response (only public-safe fields)
    $result = [];
    foreach ($documents as $doc) {
        $result[] = [
            'id' => (int) $doc['id'],
            'title' => $doc['title'],
            'description' => $doc['description'] ?? '',
            'category' => $doc['category'],
            'year' => (int) $doc['year'],
            'month' => $doc['month'] ? (int) $doc['month'] : null,
            'audit_status' => $doc['audit_status'] ?? null,
            'file_path' => $doc['file_path'],
            'created_at' => $doc['created_at'],
            'updated_at' => $doc['updated_at'],
        ];
    }

    echo json_encode(['success' => true, 'data' => $result]);

} catch (Exception $e) {
    error_log('Public documents API error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to retrieve documents']);
}
