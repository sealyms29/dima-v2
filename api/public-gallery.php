<?php
/**
 * Public Gallery API (no auth required)
 * Returns active homepage images for the React frontend
 * GET ?section=hero|gallery (optional filter)
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/GalleryManager.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(APIResponse::error('Method not allowed', 405));
    exit;
}

try {
    $filters = ['status' => 'Active'];

    if (!empty($_GET['section'])) {
        $filters['section'] = $_GET['section'];
    }

    $images = GalleryManager::getImages($filters);

    // Return minimal data for public
    $result = array_map(function($img) {
        return [
            'id' => $img['id'],
            'section' => $img['section'],
            'title' => $img['title'],
            'alt_text' => $img['alt_text'],
            'file_path' => $img['file_path'],
            'sort_order' => $img['sort_order']
        ];
    }, $images);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(APIResponse::error('Failed to load images', 500));
}
