-- ============================================================================
-- MIGRATION: Documents Management System (v2)
-- Only 2 categories: MSPO Public Report Summary, MSPO Public Notifications
-- Fields: title, year (required), month (optional), audit_status (notifications)
-- ============================================================================

-- Drop old table if exists and recreate clean
DROP TABLE IF EXISTS `documents`;

CREATE TABLE `documents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'Document name',
  `description` LONGTEXT,
  `category` ENUM('MSPO Public Report Summary', 'MSPO Public Notifications') NOT NULL,
  `year` YEAR NOT NULL,
  `month` TINYINT UNSIGNED DEFAULT NULL COMMENT '1-12 or NULL',
  `audit_status` ENUM('Upcoming Audit', 'Past Audit') DEFAULT NULL COMMENT 'Only for notifications',
  `type` ENUM('PDF') DEFAULT 'PDF',
  `file_path` VARCHAR(500) NOT NULL COMMENT 'Path: /uploads/documents/filename.pdf',
  `status` ENUM('Active', 'Archived') DEFAULT 'Active',
  `file_size` INT UNSIGNED COMMENT 'Size in bytes',
  `mime_type` VARCHAR(100) DEFAULT 'application/pdf',
  `download_count` INT UNSIGNED DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_year` (`year`),
  INDEX `idx_audit_status` (`audit_status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
