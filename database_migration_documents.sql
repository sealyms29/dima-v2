-- ============================================================================
-- MIGRATION: Add Documents Management System
-- Replaces old web forms with downloadable documents management
-- ============================================================================

-- ============================================================================
-- CREATE DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `category` ENUM('MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General') DEFAULT 'General',
  `type` ENUM('PDF', 'ExternalLink') DEFAULT 'PDF',
  `file_path` VARCHAR(500) COMMENT 'Path for PDF files: /uploads/documents/filename.pdf',
  `external_url` VARCHAR(500) COMMENT 'URL for external links',
  `status` ENUM('Active', 'Archived') DEFAULT 'Active',
  `version` VARCHAR(50),
  `file_size` INT UNSIGNED COMMENT 'Size in bytes',
  `mime_type` VARCHAR(100),
  `download_count` INT UNSIGNED DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_type` (`type`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED SAMPLE DOCUMENTS
-- ============================================================================
INSERT INTO `documents` 
  (`title`, `description`, `category`, `type`, `status`, `version`, `created_at`) 
VALUES 
  ('ISO 9001:2015 Application Form', 'Application form for ISO 9001 certification - Quality Management Systems', 'ISO9001', 'PDF', 'Active', '1.0', NOW()),
  ('ISO 9001 Questionnaire', 'Pre-audit questionnaire for ISO 9001 certification assessment', 'ISO9001', 'PDF', 'Active', '2.1', NOW()),
  ('ISO 14001:2015 Application Form', 'Application form for ISO 14001 certification - Environmental Management', 'ISO14001', 'PDF', 'Active', '1.0', NOW()),
  ('ISO 45001:2018 Application Form', 'Application form for ISO 45001 certification - Occupational Health & Safety', 'ISO45001', 'PDF', 'Active', '1.0', NOW()),
  ('MSPO Initial Assessment Document', 'Initial assessment document for MSPO certification', 'MSPO', 'PDF', 'Active', '1.0', NOW()),
  ('MSPO Surveillance Checklist', 'Surveillance audit checklist for MSPO certified clients', 'MSPO', 'PDF', 'Active', '1.5', NOW()),
  ('General Audit Schedule Template', 'Template for audit scheduling and planning', 'General', 'PDF', 'Active', '1.0', NOW());

-- ============================================================================
-- UPDATE admin_forms TABLE (Optional - for backward compatibility)
-- ============================================================================
-- The old admin_forms table can remain but will not be used
-- Future: Can migrate admin_forms data to documents table:
-- INSERT INTO documents (title, description, category, type, status, version, created_at)
-- SELECT title, description, programme, 'PDF', IF(is_active=1, 'Active', 'Archived'), 
--        version, created_at FROM admin_forms WHERE admin_forms.file_url IS NOT NULL;

-- ============================================================================
-- Create uploads/documents directory structure (via PHP)
-- ============================================================================
-- Run this SQL, then ensure /uploads/documents/ directory exists with 755 permissions:
-- mkdir -p /var/www/html/DIMA/uploads/documents
-- chmod 755 /var/www/html/DIMA/uploads/documents

COMMIT;
