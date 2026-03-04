<?php
/**
 * Admin Gallery Management Page
 * Manage homepage Hero and Gallery section images
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
    <title>Gallery Management - Admin Dashboard</title>
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

        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
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

        /* Section Panels */
        .section-panel {
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }

        .section-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }

        .section-panel-header h2 {
            font-size: 18px;
            color: #1a1a1a;
            margin: 0;
        }

        .section-panel-body {
            padding: 20px;
        }

        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }

        .image-card {
            background: white;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #e0e0e0;
            position: relative;
        }

        .image-card:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .image-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .image-card .card-body {
            padding: 12px;
        }

        .image-card .card-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .image-card .card-meta {
            color: #888;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .image-card .card-actions {
            display: flex;
            gap: 5px;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
        }

        .image-card .badge {
            position: absolute;
            top: 8px;
            right: 8px;
        }

        .badge-active {
            background: #d4edda;
            color: #155724;
        }

        .badge-inactive {
            background: #f8d7da;
            color: #721c24;
        }

        .order-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 11px;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
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

        .img-preview {
            max-width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 4px;
            margin-top: 10px;
            display: none;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .empty-state h3 {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Gallery Management</h1>
            <div class="header-actions" style="display: flex; gap: 12px; align-items: center;">
                <?php include __DIR__ . '/includes/notification-bell.php'; ?>
                <a href="<?= BASE_PATH ?>/admin/index.php" class="btn btn-secondary">&larr; Back to Dashboard</a>
            </div>
        </header>

        <nav>
            <a href="<?= BASE_PATH ?>/admin/">Dashboard</a>
            <a href="<?= BASE_PATH ?>/admin/submissions.php">Submissions</a>
            <a href="<?= BASE_PATH ?>/admin/documents.php">Documents</a>
            <a href="<?= BASE_PATH ?>/admin/gallery.php" class="active">Gallery</a>
            <a href="<?= BASE_PATH ?>/admin/content.php">Content</a>
            <a href="<?= BASE_PATH ?>/admin/contact-info.php">Contact Info</a>
            <a href="<?= BASE_PATH ?>/admin/settings.php">Settings</a>
        </nav>

        <div class="alert alert-success" id="successAlert"></div>
        <div class="alert alert-error" id="errorAlert"></div>

        <!-- Hero Section Panel -->
        <div class="section-panel">
            <div class="section-panel-header">
                <h2>Hero Section (Homepage Header Background)</h2>
                <button class="btn" onclick="openUploadModal('hero')">+ Upload Hero Image</button>
            </div>
            <div class="section-panel-body">
                <div id="heroGrid" class="image-grid"></div>
                <div id="heroEmpty" class="empty-state" style="display:none;">
                    <h3>No hero images uploaded</h3>
                    <p>Upload an image for the homepage header background. The first active image will be used.</p>
                </div>
            </div>
        </div>

        <!-- Gallery Section Panel -->
        <div class="section-panel">
            <div class="section-panel-header">
                <h2>DIMA Audit Visit For MSPO Gallery</h2>
                <button class="btn" onclick="openUploadModal('gallery')">+ Upload Gallery Image</button>
            </div>
            <div class="section-panel-body">
                <div id="galleryGrid" class="image-grid"></div>
                <div id="galleryEmpty" class="empty-state" style="display:none;">
                    <h3>No gallery images uploaded</h3>
                    <p>Upload images for the DIMA Audit Visit gallery section on the homepage.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Upload Modal -->
    <div class="modal" id="uploadModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="uploadModalTitle">Upload Image</h2>
                <button class="close-btn" onclick="closeUploadModal()">&times;</button>
            </div>
            <form id="uploadForm" onsubmit="handleUpload(event)">
                <input type="hidden" id="uploadSection" value="gallery">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="uploadTitle" placeholder="e.g. DIMA Audit Visit Team">
                </div>
                <div class="form-group">
                    <label>Alt Text <small>(for accessibility)</small></label>
                    <input type="text" id="uploadAlt" placeholder="Brief description of the image">
                </div>
                <div class="form-group">
                    <label>Image File * <small>(JPG, PNG, WebP, GIF &mdash; max 5MB)</small></label>
                    <input type="file" id="uploadFile" accept="image/jpeg,image/png,image/webp,image/gif" required onchange="previewUpload(this)">
                    <img class="img-preview" id="uploadPreview">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeUploadModal()">Cancel</button>
                    <button type="submit" class="btn">Upload</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Image</h2>
                <button class="close-btn" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm" onsubmit="handleEdit(event)">
                <input type="hidden" id="editId">
                <div style="text-align:center; margin-bottom:15px;">
                    <img id="editPreviewImg" style="max-width:100%; max-height:200px; border-radius:4px; object-fit:cover;">
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="editTitle">
                </div>
                <div class="form-group">
                    <label>Alt Text</label>
                    <input type="text" id="editAlt">
                </div>
                <div class="form-group">
                    <label>Sort Order</label>
                    <input type="number" id="editOrder" min="0">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editStatus">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="deleteImage()">Delete</button>
                    <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="btn">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let allImages = [];

        document.addEventListener('DOMContentLoaded', loadImages);

        async function loadImages() {
            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-gallery.php');
                const json = await res.json();
                if (json.success) {
                    allImages = json.data || [];
                    renderImages();
                } else {
                    showError(json.message || 'Failed to load images');
                }
            } catch (err) {
                console.error(err);
                showError('Failed to load images');
            }
        }

        function renderImages() {
            const heroImages = allImages.filter(img => img.section === 'hero');
            const galleryImages = allImages.filter(img => img.section === 'gallery');

            renderSection('heroGrid', 'heroEmpty', heroImages);
            renderSection('galleryGrid', 'galleryEmpty', galleryImages);
        }

        function renderSection(gridId, emptyId, images) {
            const grid = document.getElementById(gridId);
            const empty = document.getElementById(emptyId);

            if (images.length === 0) {
                grid.innerHTML = '';
                empty.style.display = 'block';
                return;
            }

            empty.style.display = 'none';
            grid.innerHTML = images.map(img => `
                <div class="image-card">
                    <div class="order-badge">#${img.sort_order}</div>
                    <span class="badge ${img.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${img.status}</span>
                    <img src="${img.file_path}" alt="${escHtml(img.alt_text || img.title)}" loading="lazy">
                    <div class="card-body">
                        <div class="card-title">${escHtml(img.title || 'Untitled')}</div>
                        <div class="card-meta">${escHtml(img.alt_text || '-')}</div>
                        <div class="card-actions">
                            <button class="btn btn-small" onclick="openEditModal(${img.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="confirmDelete(${img.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Upload
        function openUploadModal(section) {
            document.getElementById('uploadSection').value = section;
            const title = section === 'hero' ? 'Upload Hero Image' : 'Upload Gallery Image';
            document.getElementById('uploadModalTitle').textContent = title;
            document.getElementById('uploadModal').classList.add('active');
        }

        function closeUploadModal() {
            document.getElementById('uploadModal').classList.remove('active');
            document.getElementById('uploadForm').reset();
            document.getElementById('uploadPreview').style.display = 'none';
        }

        function previewUpload(input) {
            const preview = document.getElementById('uploadPreview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
                reader.readAsDataURL(input.files[0]);
            }
        }

        async function handleUpload(e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('section', document.getElementById('uploadSection').value);
            formData.append('title', document.getElementById('uploadTitle').value);
            formData.append('alt_text', document.getElementById('uploadAlt').value);
            formData.append('file', document.getElementById('uploadFile').files[0]);

            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-gallery.php', { method: 'POST', body: formData });
                const json = await res.json();
                if (json.success) {
                    showSuccess('Image uploaded successfully');
                    closeUploadModal();
                    loadImages();
                } else {
                    showError(json.message || 'Upload failed');
                }
            } catch (err) {
                showError('Upload failed: ' + err.message);
            }
        }

        // Edit
        function openEditModal(id) {
            const img = allImages.find(i => i.id == id);
            if (!img) return;
            document.getElementById('editId').value = img.id;
            document.getElementById('editTitle').value = img.title || '';
            document.getElementById('editAlt').value = img.alt_text || '';
            document.getElementById('editOrder').value = img.sort_order;
            document.getElementById('editStatus').value = img.status;
            document.getElementById('editPreviewImg').src = img.file_path;
            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
        }

        async function handleEdit(e) {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const img = allImages.find(i => i.id == id);
            const params = new URLSearchParams();
            params.append('id', id);
            params.append('section', img ? img.section : 'gallery');
            params.append('title', document.getElementById('editTitle').value);
            params.append('alt_text', document.getElementById('editAlt').value);
            params.append('sort_order', document.getElementById('editOrder').value);
            params.append('status', document.getElementById('editStatus').value);

            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-gallery.php', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                });
                const json = await res.json();
                if (json.success) {
                    showSuccess('Image updated successfully');
                    closeEditModal();
                    loadImages();
                } else {
                    showError(json.message || 'Update failed');
                }
            } catch (err) {
                showError('Update failed: ' + err.message);
            }
        }

        // Delete
        async function deleteImage() {
            const id = document.getElementById('editId').value;
            if (!confirm('Delete this image permanently?')) return;
            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-gallery.php?id=' + id, { method: 'DELETE' });
                const json = await res.json();
                if (json.success) {
                    showSuccess('Image deleted');
                    closeEditModal();
                    loadImages();
                } else {
                    showError(json.message || 'Delete failed');
                }
            } catch (err) {
                showError('Delete failed: ' + err.message);
            }
        }

        async function confirmDelete(id) {
            const img = allImages.find(i => i.id == id);
            if (!confirm('Delete "' + (img.title || 'Untitled') + '"?')) return;
            try {
                const res = await fetch('<?= BASE_PATH ?>/api/admin-gallery.php?id=' + id, { method: 'DELETE' });
                const json = await res.json();
                if (json.success) {
                    showSuccess('Image deleted');
                    loadImages();
                } else {
                    showError(json.message || 'Delete failed');
                }
            } catch (err) {
                showError('Delete failed');
            }
        }

        // Helpers
        function escHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function showSuccess(msg) {
            const el = document.getElementById('successAlert');
            el.textContent = msg;
            el.style.display = 'block';
            document.getElementById('errorAlert').style.display = 'none';
            setTimeout(() => el.style.display = 'none', 4000);
        }

        function showError(msg) {
            const el = document.getElementById('errorAlert');
            el.textContent = msg;
            el.style.display = 'block';
            document.getElementById('successAlert').style.display = 'none';
            setTimeout(() => el.style.display = 'none', 5000);
        }
    </script>
</body>
</html>
