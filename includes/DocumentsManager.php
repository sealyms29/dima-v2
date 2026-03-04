<?php
/**
 * Documents Manager Helper Class
 * Handles document operations, validation, and file management
 * 
 * Categories:
 *   - MSPO Public Report Summary
 *   - MSPO Public Notifications (has audit_status: Upcoming Audit / Past Audit)
 */

class DocumentsManager {
    const UPLOAD_DIR = __DIR__ . '/../uploads/documents';
    const ALLOWED_TYPES = ['application/pdf'];
    const MAX_FILE_SIZE = 10485760; // 10MB
    const CATEGORIES = ['MSPO Public Report Summary', 'MSPO Public Notifications'];
    const TYPES = ['PDF'];
    const STATUSES = ['Active', 'Archived'];
    const AUDIT_STATUSES = ['Upcoming Audit', 'Past Audit'];
    const MONTHS = [1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
                    5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
                    9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'];

    /**
     * Validate category
     */
    public static function isValidCategory($category) {
        return in_array($category, self::CATEGORIES);
    }

    /**
     * Validate type
     */
    public static function isValidType($type) {
        return in_array($type, self::TYPES);
    }

    /**
     * Validate status
     */
    public static function isValidStatus($status) {
        return in_array($status, self::STATUSES);
    }

    /**
     * Validate audit status
     */
    public static function isValidAuditStatus($audit_status) {
        return in_array($audit_status, self::AUDIT_STATUSES);
    }

    /**
     * Validate year (4-digit, reasonable range)
     */
    public static function isValidYear($year) {
        return is_numeric($year) && intval($year) >= 2000 && intval($year) <= 2100;
    }

    /**
     * Validate month (1-12 or null)
     */
    public static function isValidMonth($month) {
        if ($month === null || $month === '' || $month === '0') return true;
        return is_numeric($month) && intval($month) >= 1 && intval($month) <= 12;
    }

    /**
     * Ensure upload directory exists
     */
    public static function ensureUploadDir() {
        if (!is_dir(self::UPLOAD_DIR)) {
            mkdir(self::UPLOAD_DIR, 0755, true);
        }
    }

    /**
     * Generate safe filename
     */
    public static function generateSafeFilename($original_name) {
        $name = pathinfo($original_name, PATHINFO_FILENAME);
        $ext = 'pdf'; // Only PDF allowed
        
        // Sanitize filename: remove special chars, limit length
        $name = preg_replace('/[^a-zA-Z0-9-_]/', '_', $name);
        $name = substr($name, 0, 50); // Limit to 50 chars
        
        // Add timestamp to ensure uniqueness
        $timestamp = time();
        return "{$name}_{$timestamp}.{$ext}";
    }

    /**
     * Validate uploaded file
     */
    public static function validateUploadedFile($file) {
        $errors = [];

        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            $errors[] = 'No file uploaded';
            return $errors;
        }

        // Check file size
        if ($file['size'] > self::MAX_FILE_SIZE) {
            $errors[] = 'File size exceeds 10MB limit';
        }

        // Check MIME type
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, self::ALLOWED_TYPES)) {
            $errors[] = 'Only PDF files are allowed (MIME: ' . htmlspecialchars($mime) . ')';
        }

        // Check if it's actually a PDF by reading magic bytes
        $handle = fopen($file['tmp_name'], 'r');
        $header = fread($handle, 4);
        fclose($handle);
        if ($header !== '%PDF') {
            $errors[] = 'File is not a valid PDF (invalid file signature)';
        }

        return $errors;
    }

    /**
     * Save uploaded file to documents directory
     */
    public static function saveUploadedFile($file) {
        self::ensureUploadDir();

        $safe_filename = self::generateSafeFilename($file['name']);
        $destination = self::UPLOAD_DIR . '/' . $safe_filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to save uploaded file');
        }

        return [
            'filename' => $safe_filename,
            'path' => BASE_PATH . '/uploads/documents/' . $safe_filename,
            'size' => filesize($destination),
            'mime' => mime_content_type($destination)
        ];
    }

    /**
     * Delete document file from disk
     */
    public static function deleteFile($file_path) {
        if (!empty($file_path)) {
            // Only delete files from documents directory
            if (strpos($file_path, 'uploads/documents/') !== false) {
                $full_path = __DIR__ . '/../' . $file_path;
                if (file_exists($full_path)) {
                    unlink($full_path);
                }
            }
        }
    }

    /**
     * Get all documents, optionally filtered
     */
    public static function getDocuments($filters = []) {
        $where = [];
        $params = [];

        if (!empty($filters['id'])) {
            $where[] = 'id = ?';
            $params[] = intval($filters['id']);
        }

        if (!empty($filters['category'])) {
            $where[] = 'category = ?';
            $params[] = $filters['category'];
        }

        if (!empty($filters['status'])) {
            $where[] = 'status = ?';
            $params[] = $filters['status'];
        }

        if (!empty($filters['year'])) {
            $where[] = 'year = ?';
            $params[] = intval($filters['year']);
        }

        if (!empty($filters['audit_status'])) {
            $where[] = 'audit_status = ?';
            $params[] = $filters['audit_status'];
        }

        $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT * FROM documents $where_clause ORDER BY year DESC, month DESC, updated_at DESC";
        return Database::fetchAll($sql, $params);
    }

    /**
     * Get single document by ID
     */
    public static function getDocumentById($id) {
        return Database::fetchOne(
            "SELECT * FROM documents WHERE id = ?",
            [intval($id)]
        );
    }

    /**
     * Create new document
     */
    public static function createDocument($data) {
        $errors = [];

        $title = SecurityHelper::sanitizeString($data['title'] ?? '');
        if (empty($title) || strlen($title) > 255) {
            $errors['title'] = 'Document name is required and must not exceed 255 characters';
        }

        $category = $data['category'] ?? '';
        if (!self::isValidCategory($category)) {
            $errors['category'] = 'Invalid category. Must be: ' . implode(' or ', self::CATEGORIES);
        }

        // Year is required
        $year = $data['year'] ?? '';
        if (!self::isValidYear($year)) {
            $errors['year'] = 'Year is required (4-digit, e.g. 2024)';
        }

        // Month is optional
        $month = $data['month'] ?? null;
        if (!self::isValidMonth($month)) {
            $errors['month'] = 'Month must be 1-12 or left blank';
        }

        // audit_status only for notifications
        $audit_status = $data['audit_status'] ?? null;
        if ($category === 'MSPO Public Notifications' && !empty($audit_status)) {
            if (!self::isValidAuditStatus($audit_status)) {
                $errors['audit_status'] = 'Invalid audit status';
            }
        }

        if (empty($data['file_path'])) {
            $errors['file_path'] = 'PDF file is required';
        }

        if (!empty($errors)) {
            throw new Exception('Validation failed: ' . json_encode($errors));
        }

        $insert_data = [
            'title' => $title,
            'description' => SecurityHelper::sanitizeString($data['description'] ?? ''),
            'category' => $category,
            'type' => 'PDF',
            'status' => $data['status'] ?? 'Active',
            'year' => intval($year),
            'month' => (!empty($month) && $month !== '0') ? intval($month) : null,
            'file_path' => $data['file_path'],
            'file_size' => intval($data['file_size'] ?? 0),
            'mime_type' => $data['mime_type'] ?? 'application/pdf'
        ];

        // Only set audit_status for notifications
        if ($category === 'MSPO Public Notifications' && !empty($audit_status)) {
            $insert_data['audit_status'] = $audit_status;
        }

        return Database::insert('documents', $insert_data);
    }

    /**
     * Update document metadata
     */
    public static function updateDocument($id, $data) {
        $doc = self::getDocumentById($id);
        if (!$doc) {
            throw new Exception('Document not found');
        }

        $update_data = [];

        if (isset($data['title'])) {
            $title = SecurityHelper::sanitizeString($data['title']);
            if (empty($title) || strlen($title) > 255) {
                throw new Exception('Document name is required and must not exceed 255 characters');
            }
            $update_data['title'] = $title;
        }

        if (isset($data['description'])) {
            $update_data['description'] = SecurityHelper::sanitizeString($data['description']);
        }

        if (isset($data['category'])) {
            if (!self::isValidCategory($data['category'])) {
                throw new Exception('Invalid category');
            }
            $update_data['category'] = $data['category'];
        }

        if (isset($data['status'])) {
            if (!self::isValidStatus($data['status'])) {
                throw new Exception('Invalid status');
            }
            $update_data['status'] = $data['status'];
        }

        if (isset($data['year'])) {
            if (!self::isValidYear($data['year'])) {
                throw new Exception('Year must be a valid 4-digit year');
            }
            $update_data['year'] = intval($data['year']);
        }

        if (array_key_exists('month', $data)) {
            $month = $data['month'];
            if (!self::isValidMonth($month)) {
                throw new Exception('Month must be 1-12 or blank');
            }
            $update_data['month'] = (!empty($month) && $month !== '0') ? intval($month) : null;
        }

        // Determine the effective category for audit_status validation
        $effective_category = $data['category'] ?? $doc['category'];

        if (array_key_exists('audit_status', $data)) {
            if ($effective_category === 'MSPO Public Notifications') {
                $audit_status = $data['audit_status'];
                if (!empty($audit_status) && !self::isValidAuditStatus($audit_status)) {
                    throw new Exception('Invalid audit status');
                }
                $update_data['audit_status'] = !empty($audit_status) ? $audit_status : null;
            } else {
                // Clear audit_status if switching to non-notifications category
                $update_data['audit_status'] = null;
            }
        }

        if (!empty($update_data)) {
            Database::update('documents', $update_data, 'id', $id);
        }

        return self::getDocumentById($id);
    }

    /**
     * Delete document
     */
    public static function deleteDocument($id) {
        $doc = self::getDocumentById($id);
        if (!$doc) {
            throw new Exception('Document not found');
        }

        if (!empty($doc['file_path'])) {
            self::deleteFile($doc['file_path']);
        }

        return Database::delete('documents', 'id', $id);
    }

    /**
     * Replace PDF file for existing document
     */
    public static function replaceDocumentFile($id, $file) {
        $doc = self::getDocumentById($id);
        if (!$doc) {
            throw new Exception('Document not found');
        }

        // Validate new file
        $validation_errors = self::validateUploadedFile($file);
        if (!empty($validation_errors)) {
            throw new Exception('File validation failed: ' . implode(', ', $validation_errors));
        }

        // Save new file
        $file_info = self::saveUploadedFile($file);

        // Delete old file
        if (!empty($doc['file_path'])) {
            self::deleteFile($doc['file_path']);
        }

        // Update document record
        Database::update('documents', [
            'file_path' => $file_info['path'],
            'file_size' => $file_info['size'],
            'mime_type' => $file_info['mime']
        ], 'id', $id);

        return self::getDocumentById($id);
    }

    /**
     * Get public URL for accessing document
     */
    public static function getPublicUrl($id) {
        $doc = self::getDocumentById($id);
        if (!$doc) {
            return null;
        }
        return $doc['file_path'];
    }

    /**
     * Increment download counter
     */
    public static function incrementDownloadCount($id) {
        Database::query(
            "UPDATE documents SET download_count = download_count + 1 WHERE id = ?",
            [intval($id)]
        );
    }
}
