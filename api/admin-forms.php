<?php
/**
 * Admin Forms Management API
 * 
 * GET    /api/admin/forms - List all forms with filters
 * POST   /api/admin/forms - Create new form
 * PATCH  /api/admin/forms/{id} - Update form
 * DELETE /api/admin/forms/{id} - Delete form
 */

require_once __DIR__ . '/../includes/bootstrap.php';

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    APIResponse::send(APIResponse::error('Unauthorized', 401));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    handleListForms();
} elseif ($method === 'POST') {
    handleCreateForm();
} elseif ($method === 'PATCH') {
    handleUpdateForm();
} elseif ($method === 'DELETE') {
    handleDeleteForm();
} else {
    APIResponse::send(APIResponse::error('Method not allowed', 405));
}

function handleListForms() {
    $programme = $_GET['programme'] ?? '';
    $iso_standard = $_GET['iso_standard'] ?? '';
    $form_type = $_GET['form_type'] ?? '';
    $is_active = $_GET['is_active'] ?? '';

    $where_conditions = [];
    $params = [];

    if (!empty($programme)) {
        $where_conditions[] = 'programme = ?';
        $params[] = SecurityHelper::sanitizeString($programme);
    }

    if (!empty($iso_standard)) {
        $where_conditions[] = 'iso_standard = ?';
        $params[] = SecurityHelper::sanitizeString($iso_standard);
    }

    if (!empty($form_type)) {
        $where_conditions[] = 'form_type = ?';
        $params[] = SecurityHelper::sanitizeString($form_type);
    }

    if (!empty($is_active) && in_array($is_active, ['0', '1'])) {
        $where_conditions[] = 'is_active = ?';
        $params[] = intval($is_active);
    }

    $where = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

    try {
        $sql = "SELECT * FROM admin_forms $where ORDER BY display_order ASC, id DESC";
        $forms = Database::fetchAll($sql, $params);

        foreach ($forms as &$form) {
            foreach ($form as $key => &$value) {
                if (is_string($value)) {
                    $value = SecurityHelper::escapeHTML($value);
                }
            }
        }

        APIResponse::send(APIResponse::success($forms, 'Forms retrieved', 200));

    } catch (Exception $e) {
        error_log('List forms error: ' . $e->getMessage());
        APIResponse::send(APIResponse::error('Failed to retrieve forms', 500));
    }
}

function handleCreateForm() {
    $input = json_decode(file_get_contents('php://input'), true);

    $errors = [];

    $title = SecurityHelper::sanitizeString($input['title'] ?? '');
    if (empty($title) || strlen($title) > 255) {
        $errors['title'] = 'Title is required and must not exceed 255 characters';
    }

    $description = SecurityHelper::sanitizeString($input['description'] ?? '');
    if (strlen($description) > 1000) {
        $errors['description'] = 'Description must not exceed 1000 characters';
    }

    $form_type = $input['form_type'] ?? '';
    if (!in_array($form_type, ['pdf', 'external_link'])) {
        $errors['form_type'] = 'Form type must be pdf or external_link';
    }

    $file_url = $input['file_url'] ?? '';
    $external_link = $input['external_link'] ?? '';

    if ($form_type === 'pdf' && empty($file_url)) {
        $errors['file_url'] = 'File URL is required for PDF forms';
    } elseif ($form_type === 'external_link' && empty($external_link)) {
        $errors['external_link'] = 'External link is required';
    }

    if ($form_type === 'external_link' && !empty($external_link)) {
        if (!SecurityHelper::validateURL($external_link)) {
            $errors['external_link'] = 'Invalid URL format';
        }
    }

    $programme = $input['programme'] ?? null;
    if (!empty($programme) && !in_array($programme, ['iso', 'mspo'])) {
        $errors['programme'] = 'Invalid programme';
    }

    $iso_standard = $input['iso_standard'] ?? null;
    if (!empty($iso_standard) && !in_array($iso_standard, ['9001', '14001', '45001'])) {
        $errors['iso_standard'] = 'Invalid ISO standard';
    }

    if (!empty($errors)) {
        APIResponse::send(APIResponse::validation($errors));
    }

    try {
        DBTransaction::begin();

        $form_data = [
            'title' => $title,
            'description' => $description,
            'form_type' => $form_type,
            'file_url' => $file_url ?: null,
            'external_link' => $external_link ?: null,
            'programme' => $programme ?: null,
            'iso_standard' => $iso_standard ?: null,
            'is_active' => 1,
            'display_order' => 999,
            'version' => 1
        ];

        $id = Database::insert('admin_forms', $form_data);

        log_activity('create', 'admin_forms', $id, null, json_encode($form_data));

        DBTransaction::commit();

        APIResponse::send(APIResponse::success(
            ['id' => $id],
            'Form created successfully',
            201
        ));

    } catch (Exception $e) {
        DBTransaction::rollback();
        error_log('Create form error: ' . $e->getMessage());
        APIResponse::send(APIResponse::error('Failed to create form', 500));
    }
}

function handleUpdateForm() {
    $input = json_decode(file_get_contents('php://input'), true);

    $id = intval($input['id'] ?? 0);
    if ($id <= 0) {
        APIResponse::send(APIResponse::validation(['id' => 'Invalid form ID']));
    }

    $errors = [];

    // Get current record
    try {
        $current = Database::fetchOne('SELECT * FROM admin_forms WHERE id = ?', [$id]);
        if (!$current) {
            APIResponse::send(APIResponse::error('Form not found', 404));
        }
    } catch (Exception $e) {
        APIResponse::send(APIResponse::error('Failed to retrieve form', 500));
    }

    $update_data = [];

    if (isset($input['title'])) {
        $title = SecurityHelper::sanitizeString($input['title']);
        if (empty($title) || strlen($title) > 255) {
            $errors['title'] = 'Title must not be empty and must not exceed 255 characters';
        } else {
            $update_data['title'] = $title;
        }
    }

    if (isset($input['description'])) {
        $description = SecurityHelper::sanitizeString($input['description']);
        if (strlen($description) > 1000) {
            $errors['description'] = 'Description must not exceed 1000 characters';
        } else {
            $update_data['description'] = $description;
        }
    }

    if (isset($input['is_active'])) {
        $update_data['is_active'] = intval($input['is_active']) ? 1 : 0;
    }

    if (isset($input['display_order'])) {
        $update_data['display_order'] = intval($input['display_order']);
    }

    if (!empty($errors)) {
        APIResponse::send(APIResponse::validation($errors));
    }

    if (empty($update_data)) {
        APIResponse::send(APIResponse::error('No fields to update', 400));
    }

    try {
        DBTransaction::begin();

        Database::update('admin_forms', $update_data, 'id', $id);

        log_activity('update', 'admin_forms', $id, 
            json_encode($current),
            json_encode($update_data)
        );

        DBTransaction::commit();

        APIResponse::send(APIResponse::success(
            ['id' => $id],
            'Form updated successfully',
            200
        ));

    } catch (Exception $e) {
        DBTransaction::rollback();
        error_log('Update form error: ' . $e->getMessage());
        APIResponse::send(APIResponse::error('Failed to update form', 500));
    }
}

function handleDeleteForm() {
    $input = json_decode(file_get_contents('php://input'), true);

    $id = intval($input['id'] ?? 0);
    if ($id <= 0) {
        APIResponse::send(APIResponse::validation(['id' => 'Invalid form ID']));
    }

    try {
        DBTransaction::begin();

        $current = Database::fetchOne('SELECT * FROM admin_forms WHERE id = ?', [$id]);
        if (!$current) {
            APIResponse::send(APIResponse::error('Form not found', 404));
        }

        Database::delete('admin_forms', 'id', $id);

        log_activity('delete', 'admin_forms', $id, json_encode($current), null);

        DBTransaction::commit();

        APIResponse::send(APIResponse::success(
            ['id' => $id],
            'Form deleted successfully',
            200
        ));

    } catch (Exception $e) {
        DBTransaction::rollback();
        error_log('Delete form error: ' . $e->getMessage());
        APIResponse::send(APIResponse::error('Failed to delete form', 500));
    }
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
