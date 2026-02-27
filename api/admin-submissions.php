<?php
/**
 * GET /api/admin/submissions
 * 
 * Retrieve submissions with filtering, sorting, and pagination
 * 
 * Query parameters:
 * - type: quotation|contact|complaint
 * - status: new|viewed|responded|closed
 * - q: search query (name, email, phone)
 * - from: start date (YYYY-MM-DD)
 * - to: end date (YYYY-MM-DD)
 * - sort: column name (created_at, status, name, email)
 * - order: asc|desc
 * - page: page number (1-based)
 * - per_page: records per page (default 20, max 100)
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Authentication check (should implement proper auth)
// For now, check if admin session exists
if (!isset($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

// Parse parameters
$type = $_GET['type'] ?? 'quotation';
$status = $_GET['status'] ?? '';
$search_query = SecurityHelper::sanitizeString($_GET['q'] ?? '');
$from_date = SecurityHelper::sanitizeString($_GET['from'] ?? '');
$to_date = SecurityHelper::sanitizeString($_GET['to'] ?? '');
$sort = $_GET['sort'] ?? 'created_at';
$order = (strtoupper($_GET['order'] ?? 'DESC')) === 'ASC' ? 'ASC' : 'DESC';
$page = max(1, intval($_GET['page'] ?? 1));
$per_page = min(100, max(1, intval($_GET['per_page'] ?? 20)));

// Validate type
if (!in_array($type, ['quotation', 'contact', 'complaint'])) {
    APIResponse::send(APIResponse::error('Invalid submission type', 400));
}

// Map type to table
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
    $params[] = $status;
}

if (!empty($search_query)) {
    $where_conditions[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    $search = '%' . $search_query . '%';
    $params[] = $search;
    $params[] = $search;
    $params[] = $search;
}

if (!empty($from_date)) {
    $where_conditions[] = 'DATE(created_at) >= ?';
    $params[] = $from_date;
}

if (!empty($to_date)) {
    $where_conditions[] = 'DATE(created_at) <= ?';
    $params[] = $to_date;
}

// Validate sort column
$allowed_sorts = ['created_at', 'status', 'name', 'email', 'phone', 'id', 'updated_at'];
if (!in_array($sort, $allowed_sorts)) {
    $sort = 'created_at';
}

// Build query
$where = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count
$count_sql = "SELECT COUNT(*) as total FROM `$table` $where";
$count_result = Database::fetchOne($count_sql, $params);
$total = $count_result['total'] ?? 0;

// Get paginated results
$offset = ($page - 1) * $per_page;
$sql = "SELECT * FROM `$table` $where ORDER BY `$sort` $order LIMIT ? OFFSET ?";
$query_params = array_merge($params, [$per_page, $offset]);
$results = Database::fetchAll($sql, $query_params);

// Escape output for security
foreach ($results as &$row) {
    foreach ($row as $key => &$value) {
        if (is_string($value)) {
            $value = SecurityHelper::escapeHTML($value);
        }
    }
}

// Calculate pagination
$total_pages = ceil($total / $per_page);

APIResponse::send(APIResponse::success([
    'submissions' => $results,
    'pagination' => [
        'current_page' => $page,
        'per_page' => $per_page,
        'total' => $total,
        'total_pages' => $total_pages
    ],
    'filters' => [
        'type' => $type,
        'status' => $status,
        'search' => $search_query,
        'from_date' => $from_date,
        'to_date' => $to_date,
        'sort' => $sort,
        'order' => $order
    ]
]));
