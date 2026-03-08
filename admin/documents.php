<?php
/**
 * Admin Documents Management Page
 * Manage downloadable PDFs and external resources
 */

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../includes/SecurityHelper.php';

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

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documents Management - Admin Dashboard</title>
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 {
            font-size: 28px;
            color: #1a1a1a;
        }

        .header-actions {
            display: flex;
            gap: 10px;
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

        nav a:hover {
            background: #e0e0e0;
        }

        nav a.active {
            background: #007bff;
            color: white;
        }

        .btn {
            padding: 8px 16px;
            background: #007bff;
            color: white;
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

        .btn-secondary {
            background: #6c757d;
        }

        .btn-secondary:hover {
            background: #545b62;
        }

        .btn-danger {
            background: #dc3545;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .btn-success {
            background: #28a745;
        }

        .btn-success:hover {
            background: #218838;
        }

        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
        }

        .controls {
            background: white;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }

        .control-group {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        input[type="search"] {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            width: 200px;
        }

        .table-container {
            background: white;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #dee2e6;
            font-size: 14px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            font-size: 14px;
        }

        tr:hover {
            background: #f9f9f9;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-active {
            background: #d4edda;
            color: #155724;
        }

        .badge-archived {
            background: #f8d7da;
            color: #721c24;
        }

        .badge-pdf {
            background: #d1ecf1;
            color: #0c5460;
        }

        .badge-link {
            background: #d6d8db;
            color: #383d41;
        }

        .badge-upcoming {
            background: #fff3cd;
            color: #856404;
        }

        .badge-past {
            background: #d1ecf1;
            color: #0c5460;
        }

        .actions {
            display: flex;
            gap: 5px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
        }

        .modal-header h2 {
            font-size: 20px;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            font-size: 14px;
        }

        input[type="text"],
        input[type="number"],
        input[type="url"],
        textarea,
        select {
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

        input[type="file"] {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }

        .alert.show {
            display: block;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .file-preview {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 4px;
            font-size: 13px;
        }

        .spinner {
            display: none;
            margin-left: 10px;
        }

        .spinner.show {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .no-data {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-state h3 {
            margin-bottom: 10px;
        }

        /* ── Quotation Forms Grid ─────────────────── */
        .qf-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .qf-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }

        .qf-card-header {
            background: #f8f9fa;
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .qf-card-header .qf-logo {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            color: white;
        }

        .qf-card-header h3 {
            font-size: 15px;
            font-weight: 600;
        }

        .qf-card-body {
            padding: 16px;
        }

        .qf-slot {
            padding: 12px;
            border: 1px dashed #d0d0d0;
            border-radius: 6px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .qf-slot:last-child {
            margin-bottom: 0;
        }

        .qf-slot.has-file {
            border-style: solid;
            border-color: #c3e6cb;
            background: #f8fff8;
        }

        .qf-slot-info {
            flex: 1;
            min-width: 0;
        }

        .qf-slot-label {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 2px;
        }

        .qf-slot-title {
            font-size: 13px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .qf-slot-empty {
            font-size: 13px;
            color: #999;
            font-style: italic;
        }

        .qf-slot-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }

        .qf-btn {
            padding: 4px 10px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }

        .qf-btn-upload { background: #007bff; color: white; }
        .qf-btn-upload:hover { background: #0056b3; }
        .qf-btn-replace { background: #ffc107; color: #333; }
        .qf-btn-replace:hover { background: #e0a800; }
        .qf-btn-delete { background: #dc3545; color: white; }
        .qf-btn-delete:hover { background: #c82333; }
        .qf-btn-preview { background: #17a2b8; color: white; text-decoration: none; display: inline-block; }
        .qf-btn-preview:hover { background: #138496; }

        /* ── Section Tabs ────────────────────────── */
        .section-tabs {
            display: flex;
            gap: 0;
            background: white;
            border-radius: 4px;
            margin-bottom: 20px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        .section-tab {
            flex: 1;
            padding: 14px 20px;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            border: none;
            background: #f8f9fa;
            color: #666;
            transition: all 0.2s;
            border-bottom: 3px solid transparent;
        }

        .section-tab:hover {
            background: #f0f0f0;
            color: #333;
        }

        .section-tab.active {
            background: white;
            color: #007bff;
            border-bottom-color: #007bff;
        }

        .tab-panel {
            display: none;
        }

        .tab-panel.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📄 Documents Management</h1>
            <div class="header-actions" style="display: flex; gap: 12px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
                <button class="btn" id="uploadBtnHeader" onclick="openUploadForActiveTab()">+ Upload Report</button>
                <a href="<?= BASE_PATH ?>/admin/index.php" class="btn btn-secondary">← Back to Dashboard</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php" class="active">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <div class="alert alert-success" id="successAlert"></div>
        <div class="alert alert-error" id="errorAlert"></div>

        <!-- Section Tabs -->
        <div class="section-tabs">
            <button class="section-tab active" onclick="switchTab('reports')" id="tabReports">📊 Public Summary Reports</button>
            <button class="section-tab" onclick="switchTab('notifications')" id="tabNotifications">🔔 Public Notifications</button>
            <button class="section-tab" onclick="switchTab('quotation')" id="tabQuotation">📋 Quotation Forms</button>
            <a href="<?= BASE_PATH ?>/admin/certification_agreement.php" class="section-tab" style="text-decoration: none;">📄 Certification Agreement</a>
        </div>

        <!-- Tab 1: MSPO Public Summary Reports -->
        <div class="tab-panel active" id="panelReports">
        <div class="controls">
            <div class="control-group">
                <label style="margin-bottom: 0;">Status:</label>
                <select id="reportStatusFilter" onchange="filterReports()">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>
            <div class="control-group">
                <label style="margin-bottom: 0;">Year:</label>
                <select id="reportYearFilter" onchange="filterReports()">
                    <option value="">All Years</option>
                </select>
            </div>
            <input type="search" id="reportSearchInput" placeholder="Search by name..." onkeyup="filterReports()">
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Document Name</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="reportsBody">
                    <tr><td colspan="6" class="no-data">Loading...</td></tr>
                </tbody>
            </table>
        </div>
        </div><!-- /panelReports -->

        <!-- Tab 2: MSPO Public Notifications -->
        <div class="tab-panel" id="panelNotifications">
        <div class="controls">
            <div class="control-group">
                <label style="margin-bottom: 0;">Audit Status:</label>
                <select id="notifAuditFilter" onchange="filterNotifications()">
                    <option value="">All</option>
                    <option value="Upcoming Audit">Upcoming Audit</option>
                    <option value="Past Audit">Past Audit</option>
                </select>
            </div>
            <div class="control-group">
                <label style="margin-bottom: 0;">Status:</label>
                <select id="notifStatusFilter" onchange="filterNotifications()">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>
            <div class="control-group">
                <label style="margin-bottom: 0;">Year:</label>
                <select id="notifYearFilter" onchange="filterNotifications()">
                    <option value="">All Years</option>
                </select>
            </div>
            <input type="search" id="notifSearchInput" placeholder="Search by name..." onkeyup="filterNotifications()">
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Document Name</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Audit Status</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="notificationsBody">
                    <tr><td colspan="7" class="no-data">Loading...</td></tr>
                </tbody>
            </table>
        </div>
        </div><!-- /panelNotifications -->

        <!-- Tab 2: Quotation Forms -->
        <div class="tab-panel" id="panelQuotation">

        <div style="margin-bottom: 10px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0;">
            <h2 style="font-size: 22px; color: #1a1a1a;">📋 Quotation Forms (Application & Questionnaire)</h2>
            <p style="font-size: 13px; color: #666; margin-top: 4px;">
                Each audit programme can have <strong>1 Application Form</strong> and <strong>1 Questionnaire for Self Assessment</strong>. These appear in the quotation panel on the public site.
            </p>
        </div>

        <div id="quotationFormsGrid" class="qf-grid">
            <p style="text-align: center; color: #999; padding: 20px;">Loading quotation forms...</p>
        </div>
        </div><!-- /panelQuotation -->

        <!-- Quotation Form Upload Modal -->
        <div class="modal" id="qfUploadModal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 id="qfModalTitle">Upload Document</h2>
                    <button class="close-btn" onclick="closeQfModal()">&times;</button>
                </div>
                <form id="qfUploadForm" onsubmit="handleQfUpload(event)">
                    <input type="hidden" id="qfProgramme">
                    <input type="hidden" id="qfDocType">
                    <div class="form-group">
                        <label>Programme</label>
                        <input type="text" id="qfProgrammeDisplay" disabled style="background: #f5f5f5;">
                    </div>
                    <div class="form-group">
                        <label>Document Type</label>
                        <input type="text" id="qfDocTypeDisplay" disabled style="background: #f5f5f5;">
                    </div>
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" id="qfTitle" required placeholder="e.g., MSPO Application Form">
                    </div>
                    <div class="form-group">
                        <label>PDF File *</label>
                        <input type="file" id="qfFile" accept=".pdf" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeQfModal()">Cancel</button>
                        <button type="submit" class="btn btn-success">Upload <span class="spinner" id="qfSpinner"></span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Upload Modal for Reports -->
    <div class="modal" id="uploadReportModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Upload Public Summary Report</h2>
                <button class="close-btn" onclick="closeModal('uploadReportModal')">&times;</button>
            </div>
            <form id="uploadReportForm" onsubmit="handleUploadReport(event)">
                <div class="form-group">
                    <label>Document Name *</label>
                    <input type="text" id="reportTitle" required placeholder="e.g., MSPO Public Summary Report 2024">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="reportDescription" placeholder="Brief description of the document"></textarea>
                </div>
                <div class="form-group">
                    <label>Year *</label>
                    <input type="number" id="reportYear" required min="2000" max="2100" placeholder="e.g., 2024">
                </div>
                <div class="form-group">
                    <label>Month <small style="color:#999;">(optional)</small></label>
                    <select id="reportMonth">
                        <option value="">-- No month --</option>
                        <option value="1">January</option><option value="2">February</option><option value="3">March</option>
                        <option value="4">April</option><option value="5">May</option><option value="6">June</option>
                        <option value="7">July</option><option value="8">August</option><option value="9">September</option>
                        <option value="10">October</option><option value="11">November</option><option value="12">December</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>PDF File *</label>
                    <input type="file" id="reportFile" accept=".pdf" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('uploadReportModal')">Cancel</button>
                    <button type="submit" class="btn">Upload Document <span class="spinner" id="reportSpinner"></span></button>
                </div>
            </form>
        </div>
    </div>

    <!-- Upload Modal for Notifications -->
    <div class="modal" id="uploadNotifModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Upload Public Notification</h2>
                <button class="close-btn" onclick="closeModal('uploadNotifModal')">&times;</button>
            </div>
            <form id="uploadNotifForm" onsubmit="handleUploadNotif(event)">
                <div class="form-group">
                    <label>Document Name *</label>
                    <input type="text" id="notifTitle" required placeholder="e.g., MSPO Public Notification - December 2024">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="notifDescription" placeholder="Brief description"></textarea>
                </div>
                <div class="form-group">
                    <label>Year *</label>
                    <input type="number" id="notifYear" required min="2000" max="2100" placeholder="e.g., 2024">
                </div>
                <div class="form-group">
                    <label>Month <small style="color:#999;">(optional)</small></label>
                    <select id="notifMonth">
                        <option value="">-- No month --</option>
                        <option value="1">January</option><option value="2">February</option><option value="3">March</option>
                        <option value="4">April</option><option value="5">May</option><option value="6">June</option>
                        <option value="7">July</option><option value="8">August</option><option value="9">September</option>
                        <option value="10">October</option><option value="11">November</option><option value="12">December</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Audit Status *</label>
                    <select id="notifAuditStatus" required>
                        <option value="">-- Select Audit Status --</option>
                        <option value="Upcoming Audit">Upcoming Audit</option>
                        <option value="Past Audit">Past Audit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>PDF File *</label>
                    <input type="file" id="notifFile" accept=".pdf" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('uploadNotifModal')">Cancel</button>
                    <button type="submit" class="btn">Upload Document <span class="spinner" id="notifSpinner"></span></button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Document</h2>
                <button class="close-btn" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm" onsubmit="handleEdit(event)">
                <input type="hidden" id="editDocId">
                <div class="form-group">
                    <label>Document Name *</label>
                    <input type="text" id="editTitle" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="editDescription"></textarea>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select id="editCategory" required onchange="toggleEditAuditStatus()">
                        <option value="MSPO Public Report Summary">MSPO Public Report Summary</option>
                        <option value="MSPO Public Notifications">MSPO Public Notifications</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Year *</label>
                    <input type="number" id="editYear" required min="2000" max="2100">
                </div>
                <div class="form-group">
                    <label>Month <small style="color:#999;">(optional)</small></label>
                    <select id="editMonth">
                        <option value="">-- No month --</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div class="form-group" id="editAuditStatusGroup" style="display:none;">
                    <label>Audit Status</label>
                    <select id="editAuditStatus">
                        <option value="">-- None --</option>
                        <option value="Upcoming Audit">Upcoming Audit</option>
                        <option value="Past Audit">Past Audit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <select id="editStatus" required>
                        <option value="Active">Active</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
                <div class="form-group" id="replaceFileGroup">
                    <label>Replace PDF File</label>
                    <input type="file" id="editFile" accept=".pdf">
                    <div class="file-preview" id="editFilePreview"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="btn">Save Changes</button>
                    <button type="button" class="btn btn-danger" onclick="deleteDocument()">Delete</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // ── Active tab tracking ──────────────────────
        let activeTab = 'reports';

        function switchTab(tab) {
            activeTab = tab;
            document.getElementById('panelReports').classList.toggle('active', tab === 'reports');
            document.getElementById('panelNotifications').classList.toggle('active', tab === 'notifications');
            document.getElementById('panelQuotation').classList.toggle('active', tab === 'quotation');
            document.getElementById('tabReports').classList.toggle('active', tab === 'reports');
            document.getElementById('tabNotifications').classList.toggle('active', tab === 'notifications');
            document.getElementById('tabQuotation').classList.toggle('active', tab === 'quotation');

            // Update header upload button label
            const btn = document.getElementById('uploadBtnHeader');
            if (tab === 'reports') btn.textContent = '+ Upload Report';
            else if (tab === 'notifications') btn.textContent = '+ Upload Notification';
            else btn.textContent = '+ Upload New Document';
            btn.style.display = (tab === 'quotation') ? 'none' : 'inline-block';
        }

        function openUploadForActiveTab() {
            if (activeTab === 'reports') document.getElementById('uploadReportModal').classList.add('active');
            else if (activeTab === 'notifications') document.getElementById('uploadNotifModal').classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
            const form = document.getElementById(id).querySelector('form');
            if (form) form.reset();
        }

        // ── Data ─────────────────────────────────────
        let allDocuments = [];
        const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                             'July', 'August', 'September', 'October', 'November', 'December'];

        document.addEventListener('DOMContentLoaded', function() {
            loadDocuments();
            populateYearFilters();
        });

        function populateYearFilters() {
            const currentYear = new Date().getFullYear();
            ['reportYearFilter', 'notifYearFilter'].forEach(id => {
                const select = document.getElementById(id);
                for (let y = currentYear + 1; y >= 2000; y--) {
                    const opt = document.createElement('option');
                    opt.value = y; opt.textContent = y;
                    select.appendChild(opt);
                }
            });
        }

        async function loadDocuments() {
            try {
                const response = await fetch('<?= BASE_PATH ?>/api/admin-documents.php');
                const result = await response.json();
                if (result.success) {
                    allDocuments = result.data || [];
                    renderReports();
                    renderNotifications();
                } else {
                    showError(result.message || 'Failed to load documents');
                }
            } catch (error) {
                console.error('Error loading documents:', error);
                showError('Failed to load documents');
            }
        }

        // ── Reports table ────────────────────────────
        function getReports() {
            return allDocuments.filter(d => d.category === 'MSPO Public Report Summary');
        }

        function filterReports() {
            const status = document.getElementById('reportStatusFilter').value;
            const year = document.getElementById('reportYearFilter').value;
            const search = document.getElementById('reportSearchInput').value.toLowerCase();

            const filtered = getReports().filter(doc => {
                return (!status || doc.status === status)
                    && (!year || String(doc.year) === year)
                    && (!search || doc.title.toLowerCase().includes(search));
            });
            renderReportsTable(filtered);
        }

        function renderReports() { renderReportsTable(getReports()); }

        function renderReportsTable(docs) {
            const tbody = document.getElementById('reportsBody');
            if (docs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="no-data">No reports found</td></tr>';
                return;
            }
            tbody.innerHTML = docs.map(doc => {
                const monthStr = doc.month ? MONTH_NAMES[parseInt(doc.month)] : '-';
                return `<tr>
                    <td><strong>${truncate(doc.title, 50)}</strong></td>
                    <td>${doc.year || '-'}</td>
                    <td>${monthStr}</td>
                    <td><span class="badge ${doc.status === 'Active' ? 'badge-active' : 'badge-archived'}">${doc.status}</span></td>
                    <td>${formatDate(doc.updated_at)}</td>
                    <td><div class="actions">
                        <button class="btn btn-small" onclick="openEditModal(${doc.id})">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDelete(${doc.id})">Delete</button>
                        <a href="${doc.file_path}" class="btn btn-small" target="_blank">Preview</a>
                    </div></td>
                </tr>`;
            }).join('');
        }

        // ── Notifications table ──────────────────────
        function getNotifications() {
            return allDocuments.filter(d => d.category === 'MSPO Public Notifications');
        }

        function filterNotifications() {
            const audit = document.getElementById('notifAuditFilter').value;
            const status = document.getElementById('notifStatusFilter').value;
            const year = document.getElementById('notifYearFilter').value;
            const search = document.getElementById('notifSearchInput').value.toLowerCase();

            const filtered = getNotifications().filter(doc => {
                return (!audit || doc.audit_status === audit)
                    && (!status || doc.status === status)
                    && (!year || String(doc.year) === year)
                    && (!search || doc.title.toLowerCase().includes(search));
            });
            renderNotificationsTable(filtered);
        }

        function renderNotifications() { renderNotificationsTable(getNotifications()); }

        function renderNotificationsTable(docs) {
            const tbody = document.getElementById('notificationsBody');
            if (docs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="no-data">No notifications found</td></tr>';
                return;
            }
            tbody.innerHTML = docs.map(doc => {
                const monthStr = doc.month ? MONTH_NAMES[parseInt(doc.month)] : '-';
                const auditBadge = doc.audit_status
                    ? `<span class="badge ${doc.audit_status === 'Upcoming Audit' ? 'badge-upcoming' : 'badge-past'}">${doc.audit_status}</span>`
                    : '-';
                return `<tr>
                    <td><strong>${truncate(doc.title, 50)}</strong></td>
                    <td>${doc.year || '-'}</td>
                    <td>${monthStr}</td>
                    <td>${auditBadge}</td>
                    <td><span class="badge ${doc.status === 'Active' ? 'badge-active' : 'badge-archived'}">${doc.status}</span></td>
                    <td>${formatDate(doc.updated_at)}</td>
                    <td><div class="actions">
                        <button class="btn btn-small" onclick="openEditModal(${doc.id})">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDelete(${doc.id})">Delete</button>
                        <a href="${doc.file_path}" class="btn btn-small" target="_blank">Preview</a>
                    </div></td>
                </tr>`;
            }).join('');
        }

        // ── Upload handlers ──────────────────────────
        async function handleUploadReport(event) {
            event.preventDefault();
            const formData = new FormData();
            formData.append('title', document.getElementById('reportTitle').value);
            formData.append('description', document.getElementById('reportDescription').value);
            formData.append('category', 'MSPO Public Report Summary');
            formData.append('year', document.getElementById('reportYear').value);
            formData.append('month', document.getElementById('reportMonth').value);
            formData.append('file', document.getElementById('reportFile').files[0]);

            await doUpload(formData, 'reportSpinner', 'uploadReportModal');
        }

        async function handleUploadNotif(event) {
            event.preventDefault();
            const formData = new FormData();
            formData.append('title', document.getElementById('notifTitle').value);
            formData.append('description', document.getElementById('notifDescription').value);
            formData.append('category', 'MSPO Public Notifications');
            formData.append('year', document.getElementById('notifYear').value);
            formData.append('month', document.getElementById('notifMonth').value);
            formData.append('audit_status', document.getElementById('notifAuditStatus').value);
            formData.append('file', document.getElementById('notifFile').files[0]);

            await doUpload(formData, 'notifSpinner', 'uploadNotifModal');
        }

        async function doUpload(formData, spinnerId, modalId) {
            try {
                document.getElementById(spinnerId).classList.add('show');
                const response = await fetch('<?= BASE_PATH ?>/api/admin-documents-upload.php', {
                    method: 'POST', body: formData
                });
                const result = await response.json();
                if (result.success) {
                    showSuccess('Document uploaded successfully');
                    closeModal(modalId);
                    loadDocuments();
                } else {
                    showError(result.message || 'Upload failed');
                }
            } catch (error) {
                showError('Upload failed: ' + error.message);
            } finally {
                document.getElementById(spinnerId).classList.remove('show');
            }
        }

        // ── Edit modal (shared) ──────────────────────
        async function openEditModal(docId) {
            try {
                const response = await fetch(`<?= BASE_PATH ?>/api/admin-documents.php?id=${docId}`);
                const result = await response.json();

                if (result.success && result.data && result.data.length > 0) {
                    const doc = result.data[0];

                    document.getElementById('editDocId').value = doc.id;
                    document.getElementById('editTitle').value = doc.title;
                    document.getElementById('editDescription').value = doc.description || '';
                    document.getElementById('editCategory').value = doc.category;
                    document.getElementById('editStatus').value = doc.status;
                    document.getElementById('editYear').value = doc.year || '';
                    document.getElementById('editMonth').value = doc.month || '';

                    if (doc.category === 'MSPO Public Notifications') {
                        document.getElementById('editAuditStatusGroup').style.display = 'block';
                        document.getElementById('editAuditStatus').value = doc.audit_status || '';
                    } else {
                        document.getElementById('editAuditStatusGroup').style.display = 'none';
                        document.getElementById('editAuditStatus').value = '';
                    }

                    document.getElementById('editModal').classList.add('active');
                } else {
                    showError('Failed to load document details');
                }
            } catch (error) {
                showError('Failed to load document');
            }
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
            document.getElementById('editForm').reset();
            document.getElementById('editAuditStatusGroup').style.display = 'none';
        }

        // Show/hide audit status in Edit form
        function toggleEditAuditStatus() {
            const cat = document.getElementById('editCategory').value;
            document.getElementById('editAuditStatusGroup').style.display =
                cat === 'MSPO Public Notifications' ? 'block' : 'none';
        }

        async function handleEdit(event) {
            event.preventDefault();

            const docId = document.getElementById('editDocId').value;
            const category = document.getElementById('editCategory').value;
            const auditStatus = document.getElementById('editAuditStatus').value;
            const file = document.getElementById('editFile').files[0];

            const params = new URLSearchParams();
            params.append('id', docId);
            params.append('title', document.getElementById('editTitle').value);
            params.append('description', document.getElementById('editDescription').value);
            params.append('category', category);
            params.append('status', document.getElementById('editStatus').value);
            params.append('year', document.getElementById('editYear').value);
            params.append('month', document.getElementById('editMonth').value);
            params.append('audit_status', category === 'MSPO Public Notifications' ? auditStatus : '');

            try {
                let response = await fetch('<?= BASE_PATH ?>/api/admin-documents.php', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                });
                let result = await response.json();
                if (!result.success) { showError(result.message || 'Update failed'); return; }

                if (file) {
                    const fd = new FormData();
                    fd.append('id', docId);
                    fd.append('file', file);
                    response = await fetch('<?= BASE_PATH ?>/api/admin-documents-replace.php', { method: 'POST', body: fd });
                    result = await response.json();
                    if (!result.success) { showError(result.message || 'File replacement failed'); return; }
                }

                showSuccess('Document updated successfully');
                closeEditModal();
                loadDocuments();
            } catch (error) {
                showError('Update failed: ' + error.message);
            }
        }

        // ── Delete ───────────────────────────────────
        async function deleteDocument() {
            const docId = document.getElementById('editDocId').value;
            if (!confirm('Are you sure you want to delete this document?')) return;
            await deleteDocumentDirect(docId);
            closeEditModal();
        }

        function confirmDelete(docId) {
            const doc = allDocuments.find(d => d.id === docId);
            if (confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
                deleteDocumentDirect(docId);
            }
        }

        async function deleteDocumentDirect(docId) {
            try {
                const response = await fetch(`<?= BASE_PATH ?>/api/admin-documents.php?id=${docId}`, { method: 'DELETE' });
                const result = await response.json();
                if (result.success) { showSuccess('Document deleted successfully'); loadDocuments(); }
                else { showError(result.message || 'Delete failed'); }
            } catch (error) { showError('Delete failed: ' + error.message); }
        }

        // ── Utilities ────────────────────────────────
        function showSuccess(message) {
            const a = document.getElementById('successAlert'); a.textContent = message; a.classList.add('show');
            setTimeout(() => a.classList.remove('show'), 5000);
        }
        function showError(message) {
            const a = document.getElementById('errorAlert'); a.textContent = message; a.classList.add('show');
            setTimeout(() => a.classList.remove('show'), 5000);
        }
        function formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('en-MY', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
        }
        function formatFileSize(bytes) {
            if (!bytes) return '0 Bytes';
            const k = 1024, sizes = ['Bytes','KB','MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }
        function truncate(str, length) { return str.length > length ? str.substring(0, length) + '...' : str; }

        // ═══════════════════════════════════════════════════════════
        // Quotation Forms Management
        // ═══════════════════════════════════════════════════════════
        const QF_PROGRAMMES = [
            { key: 'MSPO',    label: 'MSPO',      color: '#28a745' },
            { key: 'ISO9001', label: 'ISO 9001',   color: '#007bff' },
            { key: 'ISO14001',label: 'ISO 14001',  color: '#6f42c1' },
            { key: 'ISO45001',label: 'ISO 45001',  color: '#fd7e14' }
        ];
        const QF_DOC_TYPES = ['Application Form', 'Questionnaire'];
        let allQfDocs = [];

        document.addEventListener('DOMContentLoaded', function() {
            loadQfDocs();
        });

        async function loadQfDocs() {
            try {
                const response = await fetch('<?= BASE_PATH ?>/api/admin-quotation-docs.php');
                const result = await response.json();
                if (result.success) {
                    allQfDocs = result.data || [];
                    renderQfGrid();
                }
            } catch (e) {
                console.error('Error loading quotation forms:', e);
            }
        }

        function getQfDoc(programme, docType) {
            return allQfDocs.find(d => d.programme === programme && d.doc_type === docType);
        }

        function renderQfGrid() {
            const grid = document.getElementById('quotationFormsGrid');
            grid.innerHTML = QF_PROGRAMMES.map(prog => {
                const appDoc = getQfDoc(prog.key, 'Application Form');
                const qDoc  = getQfDoc(prog.key, 'Questionnaire');

                return `
                    <div class="qf-card">
                        <div class="qf-card-header">
                            <div class="qf-logo" style="background: ${prog.color};">${prog.label.substring(0, 4)}</div>
                            <h3>${prog.label}</h3>
                        </div>
                        <div class="qf-card-body">
                            ${renderQfSlot(prog.key, 'Application Form', appDoc)}
                            ${renderQfSlot(prog.key, 'Questionnaire', qDoc)}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderQfSlot(programme, docType, doc) {
            const label = docType === 'Application Form' ? '📄 Application Form' : '📝 Questionnaire';
            if (doc) {
                return `
                    <div class="qf-slot has-file">
                        <div class="qf-slot-info">
                            <div class="qf-slot-label">${label}</div>
                            <div class="qf-slot-title" title="${escHtml(doc.title)}">${escHtml(doc.title)}</div>
                        </div>
                        <div class="qf-slot-actions">
                            <a href="${doc.file_path}" target="_blank" class="qf-btn qf-btn-preview">View</a>
                            <button class="qf-btn qf-btn-replace" onclick="openQfModal('${programme}','${docType}', true)">Replace</button>
                            <button class="qf-btn qf-btn-delete" onclick="deleteQfDoc(${doc.id}, '${escHtml(doc.title)}')">Delete</button>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="qf-slot">
                        <div class="qf-slot-info">
                            <div class="qf-slot-label">${label}</div>
                            <div class="qf-slot-empty">No file uploaded</div>
                        </div>
                        <div class="qf-slot-actions">
                            <button class="qf-btn qf-btn-upload" onclick="openQfModal('${programme}','${docType}', false)">Upload</button>
                        </div>
                    </div>
                `;
            }
        }

        function escHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function openQfModal(programme, docType, isReplace) {
            const progLabel = QF_PROGRAMMES.find(p => p.key === programme)?.label || programme;
            document.getElementById('qfModalTitle').textContent = isReplace ? 'Replace Document' : 'Upload Document';
            document.getElementById('qfProgramme').value = programme;
            document.getElementById('qfDocType').value = docType;
            document.getElementById('qfProgrammeDisplay').value = progLabel;
            document.getElementById('qfDocTypeDisplay').value = docType;

            // Pre-fill title
            const existing = getQfDoc(programme, docType);
            document.getElementById('qfTitle').value = existing ? existing.title : (progLabel + ' - ' + docType);
            document.getElementById('qfFile').required = true;
            document.getElementById('qfUploadModal').classList.add('active');
        }

        function closeQfModal() {
            document.getElementById('qfUploadModal').classList.remove('active');
            document.getElementById('qfUploadForm').reset();
        }

        async function handleQfUpload(event) {
            event.preventDefault();

            const programme = document.getElementById('qfProgramme').value;
            const docType   = document.getElementById('qfDocType').value;
            const title     = document.getElementById('qfTitle').value;
            const file      = document.getElementById('qfFile').files[0];

            if (!file) { showError('Please select a PDF file'); return; }

            const formData = new FormData();
            formData.append('programme', programme);
            formData.append('doc_type', docType);
            formData.append('title', title);
            formData.append('file', file);

            try {
                document.getElementById('qfSpinner').classList.add('show');
                const response = await fetch('<?= BASE_PATH ?>/api/admin-quotation-docs.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    showSuccess(result.message || 'Document uploaded successfully');
                    closeQfModal();
                    loadQfDocs();
                } else {
                    showError(result.message || 'Upload failed');
                }
            } catch (e) {
                showError('Upload failed: ' + e.message);
            } finally {
                document.getElementById('qfSpinner').classList.remove('show');
            }
        }

        async function deleteQfDoc(id, title) {
            if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

            try {
                const response = await fetch(`<?= BASE_PATH ?>/api/admin-quotation-docs.php?id=${id}`, { method: 'DELETE' });
                const result = await response.json();

                if (result.success) {
                    showSuccess('Document deleted successfully');
                    loadQfDocs();
                } else {
                    showError(result.message || 'Delete failed');
                }
            } catch (e) {
                showError('Delete failed: ' + e.message);
            }
        }
    </script>
</body>
</html>
