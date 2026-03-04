<?php
/**
 * GET /api/admin/export
 * 
 * Export submissions as CSV
 * 
 * Query parameters:
 * - type: quotation|contact|complaint
 * - status: (optional filter)
 * - from: YYYY-MM-DD (optional date filter)
 * - to: YYYY-MM-DD (optional date filter)
 * - q: (optional search term)
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Authentication check - DISABLED for localhost development
// For production, enable this:
// if (!isset($_SESSION['admin_user_id'])) {
//     APIResponse::send(APIResponse::error('Unauthorized', 401));
// }

$type = $_GET['type'] ?? '';
$status = $_GET['status'] ?? '';
$search = SecurityHelper::sanitizeString($_GET['q'] ?? '');
$date_from = $_GET['from'] ?? '';
$date_to = $_GET['to'] ?? '';

// Validate type
if (!in_array($type, ['quotation', 'contact', 'complaint'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid submission type']);
    exit;
}

$tables = [
    'quotation' => 'quotations',
    'contact' => 'contacts',
    'complaint' => 'complaints'
];
$table = $tables[$type];

// Build WHERE clause
$where_conditions = [];
$params = [];

if (!empty($status)) {
    $where_conditions[] = 'status = ?';
    $params[] = SecurityHelper::sanitizeString($status);
}

if (!empty($search)) {
    $where_conditions[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    $search_term = '%' . $search . '%';
    $params[] = $search_term;
    $params[] = $search_term;
    $params[] = $search_term;
}

if (!empty($date_from) && strtotime($date_from)) {
    $where_conditions[] = 'created_at >= ?';
    $params[] = $date_from . ' 00:00:00';
}

if (!empty($date_to) && strtotime($date_to)) {
    $where_conditions[] = 'created_at <= ?';
    $params[] = $date_to . ' 23:59:59';
}

$where = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

try {
    $sql = "SELECT * FROM `$table` $where ORDER BY created_at DESC";
    $submissions = Database::fetchAll($sql, $params);

    // Set CSV headers
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $type . '_export_' . date('Y-m-d_His') . '.csv"');

    // Create CSV output
    $output = fopen('php://output', 'w');
    
    // Write BOM for Excel UTF-8 compatibility
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

    // Column headers based on type
    if ($type === 'complaint') {
        $headers = ['ID', 'Type', 'Programme', 'ISO Standard', 'Name', 'Email', 'Phone', 'Organization', 
                   'Description', 'Evidence', 'Status', 'Priority', 'Created', 'Updated', 'Notes'];
    } else {
        $headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Status', 'Created', 'Updated', 'Notes'];
    }

    fputcsv($output, $headers);

    // Write data rows
    foreach ($submissions as $row) {
        if ($type === 'complaint') {
            $csv_row = [
                $row['id'],
                $row['complaint_type'] ?? '',
                $row['programme'] ?? '',
                $row['iso_standard'] ?? '',
                $row['name'],
                $row['email'],
                $row['phone'],
                $row['organization'] ?? '',
                $row['description'] ?? '',
                $row['evidence'] ?? '',
                $row['status'],
                $row['priority'] ?? '',
                $row['created_at'],
                $row['updated_at'] ?? '',
                $row['internal_notes'] ?? ''
            ];
        } else {
            $csv_row = [
                $row['id'],
                $row['name'],
                $row['email'],
                $row['phone'],
                $row['company'] ?? '',
                $row['message'],
                $row['status'],
                $row['created_at'],
                $row['updated_at'],
                $row['notes'] ?? ''
            ];
        }
        
        fputcsv($output, $csv_row);
    }

    fclose($output);
    exit;

} catch (Exception $e) {
    error_log('Export error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to export data']);
    exit;
}
