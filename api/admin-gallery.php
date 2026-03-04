<?php
/**
 * Admin Gallery API
 * GET    - List all images (with optional section filter)
 * POST   - Upload new image
 * PATCH  - Update image metadata
 * DELETE - Delete image
 */

require_once __DIR__ . '/../includes/bootstrap.php';
require_once __DIR__ . '/../includes/GalleryManager.php';

// Check admin auth
if (empty($_SESSION['admin_user_id'])) {
    http_response_code(401);
    echo json_encode(APIResponse::error('Unauthorized', 401));
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    case 'PATCH':
        handlePatch();
        break;
    case 'DELETE':
        handleDelete();
        break;
    default:
        http_response_code(405);
        echo json_encode(APIResponse::error('Method not allowed', 405));
}

function handleGet() {
    try {
        $filters = [];
        if (!empty($_GET['section'])) $filters['section'] = $_GET['section'];
        if (!empty($_GET['status'])) $filters['status'] = $_GET['status'];
        if (!empty($_GET['id'])) $filters['id'] = $_GET['id'];

        $images = GalleryManager::getImages($filters);
        echo json_encode(APIResponse::success($images));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(APIResponse::error($e->getMessage(), 500));
    }
}

function handlePost() {
    try {
        // Check for reorder action
        if (!empty($_POST['action']) && $_POST['action'] === 'reorder') {
            $section = $_POST['section'] ?? '';
            $ids = json_decode($_POST['ids'] ?? '[]', true);
            if (empty($section) || empty($ids)) {
                throw new \Exception('Section and ids are required for reorder');
            }
            GalleryManager::reorderImages($section, $ids);
            echo json_encode(APIResponse::success(null, 'Images reordered'));
            return;
        }

        $file = $_FILES['file'] ?? null;
        $result = GalleryManager::createImage($_POST, $file);
        http_response_code(201);
        echo json_encode(APIResponse::success($result, 'Image uploaded'));
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}

function handlePatch() {
    try {
        parse_str(file_get_contents('php://input'), $data);

        $id = $data['id'] ?? null;
        if (empty($id)) {
            throw new \Exception('Image ID is required');
        }

        $result = GalleryManager::updateImage(intval($id), $data);
        echo json_encode(APIResponse::success($result, 'Image updated'));
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}

function handleDelete() {
    try {
        $id = $_GET['id'] ?? null;
        if (empty($id)) {
            throw new \Exception('Image ID is required');
        }

        GalleryManager::deleteImage(intval($id));
        echo json_encode(APIResponse::success(null, 'Image deleted'));
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(APIResponse::error($e->getMessage(), 400));
    }
}
