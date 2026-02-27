<?php
/**
 * PATCH /api/admin/submissions/{id}
 * 
 * Update submission status and notes
 * 
 * Request body (JSON):
 * {
 *   "type": "quotation",
 *   "id": 123,
 *   "status": "responded",
 *   "notes": "Follow-up sent"
 * }
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Only allow PATCH
if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

$input = json_decode(file_get_contents('php://input'), true);

$errors = [];

// Validate type
$type = $input['type'] ?? '';
if (!in_array($type, ['quotation', 'contact', 'complaint'])) {
    $errors['type'] = 'Invalid submission type';
}

// Validate ID
$id = intval($input['id'] ?? 0);
if ($id <= 0) {
    $errors['id'] = 'Invalid submission ID';
}

// Map type to table
$tables = [
    'quotation' => 'quotations',
    'contact' => 'contacts',
    'complaint' => 'complaints'
];
$table = $tables[$type] ?? null;

if (empty($table)) {
    APIResponse::send(APIResponse::error('Invalid type', 400));
}

// Validate status
$status = $input['status'] ?? null;
$allowed_statuses = [
    'quotations' => ['new', 'viewed', 'responded', 'closed'],
    'contacts' => ['new', 'viewed', 'responded', 'closed'],
    'complaints' => ['new', 'under_review', 'responded', 'resolved', 'closed']
];

if (!in_array($status, $allowed_statuses[$table])) {
    $errors['status'] = 'Invalid status';
}

// Notes (optional)
$notes = isset($input['notes']) ? SecurityHelper::sanitizeString($input['notes']) : null;
if (!empty($notes) && strlen($notes) > 5000) {
    $errors['notes'] = 'Notes must not exceed 5000 characters';
}

if (!empty($errors)) {
    APIResponse::send(APIResponse::validation($errors));
}

try {
    DBTransaction::begin();

    // Get current record
    $current = Database::fetchOne("SELECT * FROM `$table` WHERE id = ?", [$id]);
    if (!$current) {
        APIResponse::send(APIResponse::error('Submission not found', 404));
    }

    // Prepare update data
    $update_data = [
        'status' => $status,
        'responded_by' => $_SESSION['admin_user_id'],
        'updated_at' => date('Y-m-d H:i:s')
    ];

    if (!is_null($notes)) {
        $update_data['notes'] = $notes;
    }

    // Update record
    Database::update($table, $update_data, 'id', $id);

    // Log activity
    log_activity('update', $table, $id, 
        json_encode(['status' => $current['status']]),
        json_encode(['status' => $status, 'notes' => $notes])
    );

    DBTransaction::commit();

    APIResponse::send(APIResponse::success(
        ['id' => $id],
        'Submission updated successfully',
        200
    ));

} catch (Exception $e) {
    DBTransaction::rollback();
    error_log('Submission update error: ' . $e->getMessage());
    APIResponse::send(APIResponse::error('Failed to update submission', 500));
}

function log_activity($action, $table_name, $record_id, $old_value = null, $new_value = null) {
    try {
        Database::insert('admin_logs', [
            'user_id' => $_SESSION['admin_user_id'] ?? null,
            'action' => $action,
            'table_name' => $table_name,
            'record_id' => $record_id,
            'old_value' => $old_value,
            'new_value' => $new_value,
            'ip_address' => SecurityHelper::getClientIP()
        ]);
    } catch (Exception $e) {
        error_log('Failed to log activity: ' . $e->getMessage());
    }
}
