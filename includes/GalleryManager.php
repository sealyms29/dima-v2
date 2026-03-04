<?php
/**
 * Gallery Manager Helper Class
 * Handles homepage image operations (Hero + Gallery sections)
 */

class GalleryManager {
    const UPLOAD_DIR = __DIR__ . '/../uploads/gallery';
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_FILE_SIZE = 5242880; // 5MB
    const SECTIONS = ['hero', 'gallery'];
    const STATUSES = ['Active', 'Inactive'];

    /**
     * Ensure upload directory exists
     */
    public static function ensureUploadDir() {
        if (!is_dir(self::UPLOAD_DIR)) {
            mkdir(self::UPLOAD_DIR, 0755, true);
        }
    }

    /**
     * Get images with optional filters
     */
    public static function getImages($filters = []) {
        $pdo = Database::getPDO();
        $where = [];
        $params = [];

        if (!empty($filters['id'])) {
            $where[] = 'id = :id';
            $params[':id'] = intval($filters['id']);
        }

        if (!empty($filters['section'])) {
            $where[] = 'section = :section';
            $params[':section'] = $filters['section'];
        }

        if (!empty($filters['status'])) {
            $where[] = 'status = :status';
            $params[':status'] = $filters['status'];
        }

        $sql = 'SELECT * FROM homepage_images';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY section ASC, sort_order ASC, id DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Upload and create a new image
     */
    public static function createImage($data, $file) {
        self::ensureUploadDir();

        // Validate section
        $section = $data['section'] ?? 'gallery';
        if (!in_array($section, self::SECTIONS)) {
            throw new \Exception('Invalid section. Must be: ' . implode(', ', self::SECTIONS));
        }

        // Validate file
        if (empty($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception('Image file is required');
        }

        if ($file['size'] > self::MAX_FILE_SIZE) {
            throw new \Exception('File too large. Maximum 5MB allowed');
        }

        $mimeType = mime_content_type($file['tmp_name']);
        if (!in_array($mimeType, self::ALLOWED_TYPES)) {
            throw new \Exception('Invalid file type. Allowed: JPG, PNG, WebP, GIF');
        }

        // Generate unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($file['name'], PATHINFO_FILENAME));
        $fileName = $safeName . '_' . time() . '.' . $ext;
        $destPath = self::UPLOAD_DIR . '/' . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            throw new \Exception('Failed to save file');
        }

        $filePath = BASE_PATH . '/uploads/gallery/' . $fileName;

        // Get next sort order
        $pdo = Database::getPDO();
        $stmt = $pdo->prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM homepage_images WHERE section = :section');
        $stmt->execute([':section' => $section]);
        $nextOrder = $stmt->fetch()['next_order'];

        $title = $data['title'] ?? '';
        $altText = $data['alt_text'] ?? $title;

        $stmt = $pdo->prepare('INSERT INTO homepage_images (section, title, alt_text, file_path, file_name, sort_order, status) VALUES (:section, :title, :alt_text, :file_path, :file_name, :sort_order, :status)');
        $stmt->execute([
            ':section' => $section,
            ':title' => $title,
            ':alt_text' => $altText,
            ':file_path' => $filePath,
            ':file_name' => $file['name'],
            ':sort_order' => $nextOrder,
            ':status' => 'Active'
        ]);

        return [
            'id' => $pdo->lastInsertId(),
            'section' => $section,
            'title' => $title,
            'alt_text' => $altText,
            'file_path' => $filePath,
            'sort_order' => $nextOrder,
            'status' => 'Active'
        ];
    }

    /**
     * Update image metadata
     */
    public static function updateImage($id, $data) {
        $pdo = Database::getPDO();

        $fields = [];
        $params = [':id' => intval($id)];

        if (isset($data['title'])) {
            $fields[] = 'title = :title';
            $params[':title'] = $data['title'];
        }
        if (isset($data['alt_text'])) {
            $fields[] = 'alt_text = :alt_text';
            $params[':alt_text'] = $data['alt_text'];
        }
        if (isset($data['section']) && in_array($data['section'], self::SECTIONS)) {
            $fields[] = 'section = :section';
            $params[':section'] = $data['section'];
        }
        if (isset($data['sort_order'])) {
            $fields[] = 'sort_order = :sort_order';
            $params[':sort_order'] = intval($data['sort_order']);
        }
        if (isset($data['status']) && in_array($data['status'], self::STATUSES)) {
            $fields[] = 'status = :status';
            $params[':status'] = $data['status'];
        }

        if (empty($fields)) {
            throw new \Exception('No fields to update');
        }

        $sql = 'UPDATE homepage_images SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::getImages(['id' => $id])[0] ?? null;
    }

    /**
     * Delete image (and its file)
     */
    public static function deleteImage($id) {
        $pdo = Database::getPDO();

        // Get image first to delete file
        $images = self::getImages(['id' => $id]);
        if (empty($images)) {
            throw new \Exception('Image not found');
        }

        $image = $images[0];

        // Delete physical file
        $fullPath = __DIR__ . '/../' . ltrim(str_replace(BASE_PATH . '/', '', $image['file_path']), '/');
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }

        // Delete record
        $stmt = $pdo->prepare('DELETE FROM homepage_images WHERE id = :id');
        $stmt->execute([':id' => intval($id)]);

        return true;
    }

    /**
     * Reorder images within a section
     */
    public static function reorderImages($section, $orderedIds) {
        $pdo = Database::getPDO();
        $stmt = $pdo->prepare('UPDATE homepage_images SET sort_order = :order WHERE id = :id AND section = :section');

        foreach ($orderedIds as $index => $id) {
            $stmt->execute([
                ':order' => $index + 1,
                ':id' => intval($id),
                ':section' => $section
            ]);
        }

        return true;
    }
}
