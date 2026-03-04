<?php
/**
 * Admin Forms Management Page
 */

header('Content-Type: text/html; charset=utf-8');

// Include config and start session
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../includes/SecurityHelper.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'secure' => SESSION_SECURE,
        'httponly' => SESSION_HTTPONLY,
        'samesite' => 'Strict'
    ]);
    session_start();
}

// Authentication check
if (!isset($_SESSION['admin_user_id'])) {
    header('Location: ' . BASE_PATH . '/admin/login.php');
    exit;
}

// Fetch forms directly from database
$forms = [];
try {
    $forms = Database::fetchAll("SELECT * FROM admin_forms ORDER BY display_order ASC, created_at DESC");
    foreach ($forms as &$form) {
        foreach ($form as $key => &$value) {
            if (is_string($value)) {
                $value = SecurityHelper::escapeHTML($value);
            }
        }
    }
} catch (Exception $e) {
    error_log('Forms query error: ' . $e->getMessage());
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forms Management - Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        h1 {
            font-size: 24px;
            color: #1a1a1a;
        }

        nav {
            background: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        nav a {
            display: inline-block;
            padding: 8px 16px;
            margin-right: 10px;
            background: #f0f0f0;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }

        nav a.active {
            background: #007bff;
            color: white;
        }

        .toolbar {
            background: white;
            padding: 15px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #e0e0e0;
        }

        .btn {
            background: #007bff;
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }

        .btn:hover {
            background: #0056b3;
        }

        .btn-danger {
            background: #dc3545;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .btn-secondary {
            background: #6c757d;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .forms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .form-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
        }

        .form-card h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #1a1a1a;
        }

        .form-card p {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            line-height: 1.5;
        }

        .form-meta {
            font-size: 12px;
            color: #999;
            margin-bottom: 12px;
            display: flex;
            gap: 15px;
        }

        .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 12px;
        }

        .badge-active {
            background: #d4edda;
            color: #155724;
        }

        .badge-inactive {
            background: #f8d7da;
            color: #721c24;
        }

        .badge-pdf {
            background: #d1ecf1;
            color: #0c5460;
        }

        .badge-link {
            background: #fff3cd;
            color: #856404;
        }

        .form-actions {
            display: flex;
            gap: 8px;
            margin-top: 15px;
        }

        .form-actions button {
            flex: 1;
            padding: 8px 12px;
            font-size: 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        .edit-btn {
            background: #28a745;
            color: white;
        }

        .edit-btn:hover {
            background: #218838;
        }

        .delete-btn {
            background: #dc3545;
            color: white;
        }

        .delete-btn:hover {
            background: #c82333;
        }

        .empty-message {
            background: white;
            padding: 40px;
            text-align: center;
            color: #999;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }

        .modal.show {
            display: block;
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            max-width: 600px;
            border-radius: 4px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: black;
        }

        .modal h2 {
            margin-bottom: 20px;
            font-size: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 14px;
        }

        input, select, textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }

        .checkbox-group {
            display: flex;
            gap: 15px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .checkbox-item input {
            width: auto;
            margin: 0;
        }

        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Forms Management</h1>
            <div style="display: flex; gap: 20px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/forms.php" class="active">Forms</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <div class="toolbar">
            <h2 style="font-size: 18px; margin: 0;">Downloadable Forms & Links</h2>
            <button class="btn" onclick="openCreateModal()">+ Add New Form</button>
        </div>

        <?php if (!empty($forms)): ?>
            <div class="forms-grid">
                <?php foreach ($forms as $form): ?>
                    <div class="form-card">
                        <h3><?php echo htmlspecialchars($form['title']); ?></h3>
                        <p><?php echo htmlspecialchars($form['description']); ?></p>

                        <div class="form-meta">
                            <span class="badge badge-<?php echo $form['form_type']; ?>">
                                <?php echo $form['form_type'] === 'pdf' ? 'PDF' : 'External Link'; ?>
                            </span>
                            <span class="badge <?php echo $form['is_active'] ? 'badge-active' : 'badge-inactive'; ?>">
                                <?php echo $form['is_active'] ? 'Active' : 'Inactive'; ?>
                            </span>
                            <?php if (!empty($form['programme'])): ?>
                                <span class="badge"><?php echo strtoupper($form['programme']); ?></span>
                            <?php endif; ?>
                        </div>

                        <p style="font-size: 12px; color: #999;">
                            <?php if ($form['form_type'] === 'pdf'): ?>
                                URL: <?php echo htmlspecialchars($form['file_url']); ?>
                            <?php else: ?>
                                Link: <?php echo htmlspecialchars($form['external_link']); ?>
                            <?php endif; ?>
                        </p>

                        <div class="form-actions">
                            <button class="edit-btn" onclick="editForm(<?php echo htmlspecialchars(json_encode($form)); ?>)">Edit</button>
                            <button class="delete-btn" onclick="deleteForm(<?php echo $form['id']; ?>)">Delete</button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="empty-message">
                <p>No forms found. Click "Add New Form" to create one.</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Create/Edit Modal -->
    <div id="formModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Add New Form</h2>

            <form id="formForm">
                <input type="hidden" id="formId" name="id">

                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" required>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                </div>

                <div class="form-group">
                    <label for="formType">Form Type *</label>
                    <select id="formType" name="form_type" onchange="updateFormTypeFields()" required>
                        <option value="pdf">PDF File</option>
                        <option value="external_link">External Link</option>
                    </select>
                </div>

                <div class="form-group" id="pdfGroup">
                    <label for="fileUrl">PDF URL *</label>
                    <input type="text" id="fileUrl" name="file_url" placeholder="https://example.com/form.pdf">
                </div>

                <div class="form-group" id="linkGroup" style="display: none;">
                    <label for="externalLink">External URL *</label>
                    <input type="text" id="externalLink" name="external_link" placeholder="https://example.com">
                </div>

                <div class="form-group">
                    <label for="programme">Programme</label>
                    <select id="programme" name="programme">
                        <option value="">-- Select --</option>
                        <option value="iso">ISO</option>
                        <option value="mspo">MSPO</option>
                    </select>
                </div>

                <div class="form-group" id="isoGroup" style="display: none;">
                    <label for="isoStandard">ISO Standard</label>
                    <select id="isoStandard" name="iso_standard">
                        <option value="">-- Select --</option>
                        <option value="9001">9001</option>
                        <option value="14001">14001</option>
                        <option value="45001">45001</option>
                    </select>
                </div>

                <div class="form-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="isActive" name="is_active" value="1" checked>
                        <label for="isActive" style="margin: 0; margin-left: 5px;">Active</label>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn">Save Form</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openCreateModal() {
            document.getElementById('formId').value = '';
            document.getElementById('formForm').reset();
            document.getElementById('modalTitle').textContent = 'Add New Form';
            document.getElementById('formModal').classList.add('show');
        }

        function closeModal() {
            document.getElementById('formModal').classList.remove('show');
        }

        function updateFormTypeFields() {
            const type = document.getElementById('formType').value;
            const pdfGroup = document.getElementById('pdfGroup');
            const linkGroup = document.getElementById('linkGroup');

            if (type === 'pdf') {
                pdfGroup.style.display = 'block';
                linkGroup.style.display = 'none';
            } else {
                pdfGroup.style.display = 'none';
                linkGroup.style.display = 'block';
            }
        }

        function editForm(form) {
            document.getElementById('formId').value = form.id;
            document.getElementById('title').value = form.title;
            document.getElementById('description').value = form.description;
            document.getElementById('formType').value = form.form_type;
            document.getElementById('fileUrl').value = form.file_url || '';
            document.getElementById('externalLink').value = form.external_link || '';
            document.getElementById('programme').value = form.programme || '';
            document.getElementById('isoStandard').value = form.iso_standard || '';
            document.getElementById('isActive').checked = form.is_active;

            updateFormTypeFields();
            updateProgrammeFields();

            document.getElementById('modalTitle').textContent = 'Edit Form';
            document.getElementById('formModal').classList.add('show');
        }

        function updateProgrammeFields() {
            const programme = document.getElementById('programme').value;
            const isoGroup = document.getElementById('isoGroup');

            if (programme === 'iso') {
                isoGroup.style.display = 'block';
            } else {
                isoGroup.style.display = 'none';
            }
        }

        function deleteForm(id) {
            if (!confirm('Are you sure you want to delete this form?')) {
                return;
            }

            fetch('/api/admin-forms.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Failed to delete form');
                }
            })
            .catch(e => alert('Error: ' + e));
        }

        document.getElementById('formForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const id = document.getElementById('formId').value;
            const method = id ? 'PATCH' : 'POST';
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            data.is_active = document.getElementById('isActive').checked ? 1 : 0;

            fetch('/api/admin-forms.php', {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(e => alert('Error: ' + e));
        });

        document.getElementById('programme').addEventListener('change', updateProgrammeFields);

        // Close modal on outside click
        window.onclick = function(e) {
            const modal = document.getElementById('formModal');
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        }
    </script>
</body>
</html>
