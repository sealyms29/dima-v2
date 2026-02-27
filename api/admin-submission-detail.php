<?php
/**
 * GET /api/admin/submissions/{id}?type={type}
 * 
 * Get single submission detail
 * 
 * Query parameters:
 * - type: quotation|contact|complaint (required)
 * - id: Submission ID (in URL path or query param)
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

$type = $_GET['type'] ?? '';
$id = intval($_GET['id'] ?? 0);

$errors = [];

// Validate type
if (!in_array($type, ['quotation', 'contact', 'complaint'])) {
    $errors['type'] = 'Invalid submission type';
}

// Validate ID
if ($id <= 0) {
    $errors['id'] = 'Invalid submission ID';
}

if (!empty($errors)) {
    APIResponse::send(APIResponse::validation($errors));
}

// Map type to table
$tables = [
    'quotation' => 'quotations',
    'contact' => 'contacts',
    'complaint' => 'complaints'
];
$table = $tables[$type];

try {
    $sql = <<<SQL
    SELECT * FROM `$table` WHERE id = ?
    SQL;
    
    $submission = Database::fetchOne($sql, [$id]);
    
    if (!$submission) {
        APIResponse::send(APIResponse::error('Submission not found', 404));
    }

    // Escape all string values
    foreach ($submission as $key => &$value) {
        if (is_string($value)) {
            $value = SecurityHelper::escapeHTML($value);
        }
    }

    APIResponse::send(APIResponse::success($submission, 'Submission retrieved', 200));

} catch (Exception $e) {
    error_log('Get submission error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to retrieve submission', 500));
}
