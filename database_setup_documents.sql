-- ============================================================================
-- DIMA DOCUMENTS SYSTEM - SETUP & MIGRATION GUIDE
-- ============================================================================
-- This script sets up the new Documents Management System which replaces
-- the old web forms module with a proper document management system.
--
-- Changes:
-- 1. Creates new 'documents' table for managing PDFs and external links
-- 2. Keeps old 'admin_forms' table for backward compatibility
-- 3. Adds sample documents for all ISO standards and MSPO
-- 4. Removes web form building functionality
-- ============================================================================

USE `dima_production`;

-- ============================================================================
-- STEP 1: CREATE DOCUMENTS TABLE (if not already created)
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
-- STEP 2: INSERT SAMPLE DOCUMENTS
-- ============================================================================
-- Note: These are placeholders. Replace file_path values with actual uploaded files
INSERT IGNORE INTO `documents` 
  (`title`, `description`, `category`, `type`, `status`, `version`, `created_at`) 
VALUES 
  ('ISO 9001:2015 Application Form', 
   'Comprehensive application form for ISO 9001 certification - Quality Management Systems. Please fill in all required fields and submit with supporting documentation.', 
   'ISO9001', 'PDF', 'Active', '1.0', NOW()),
   
  ('ISO 9001 Pre-Audit Questionnaire', 
   'Pre-audit questionnaire to help DMC understand your current quality management systems and identify areas for improvement.', 
   'ISO9001', 'PDF', 'Active', '2.1', NOW()),
   
  ('ISO 14001:2015 Application Form', 
   'Application form for ISO 14001 certification - Environmental Management Systems. Applicable to organizations of all sizes.', 
   'ISO14001', 'PDF', 'Active', '1.0', NOW()),
   
  ('ISO 45001:2018 Application Form', 
   'Application form for ISO 45001 certification - Occupational Health and Safety Management Systems. For all organization types.', 
   'ISO45001', 'PDF', 'Active', '1.0', NOW()),
   
  ('MSPO Initial Assessment Document', 
   'Initial assessment document for MSPO (Malaysian Sustainable Palm Oil) certification. Required for all applicants.', 
   'MSPO', 'PDF', 'Active', '1.0', NOW()),
   
  ('MSPO Surveillance Audit Checklist', 
   'Comprehensive checklist used during surveillance audits for MSPO certified clients. Updated annually.', 
   'MSPO', 'PDF', 'Active', '1.5', NOW()),
   
  ('General Audit Schedule Template', 
   'Template for internal use in scheduling and organizing audit activities. Applicable across all certification programmes.', 
   'General', 'PDF', 'Active', '1.0', NOW());

-- ============================================================================
-- STEP 3: VERIFY TABLE STRUCTURE
-- ============================================================================
-- Run this query to verify the documents table is set up correctly:
-- SELECT * FROM documents;
-- SELECT COUNT(*) as total_documents FROM documents WHERE status = 'Active';

-- ============================================================================
-- STEP 4: FILE SYSTEM SETUP (Run via PHP/Terminal)
-- ============================================================================
-- Create the following directory with proper permissions:
-- mkdir -p /var/www/html/DIMA/uploads/documents
-- chmod 755 /var/www/html/DIMA/uploads/documents
-- chmod 644 /var/www/html/DIMA/uploads/documents/*.pdf

-- ============================================================================
-- STEP 5: OPTIONAL - MIGRATE OLD FORMS TO DOCUMENTS
-- ============================================================================
-- If you want to migrate data from the old admin_forms table:
/*
INSERT INTO documents (title, description, category, type, status, version, created_at)
SELECT 
    title,
    description,
    COALESCE(programme, 'General'),
    IF(file_url IS NOT NULL, 'PDF', 'ExternalLink'),
    IF(is_active = 1, 'Active', 'Archived'),
    version,
    created_at
FROM admin_forms
WHERE file_url IS NOT NULL OR external_link IS NOT NULL
ON DUPLICATE KEY UPDATE documents.id = documents.id;
*/

-- ============================================================================
-- STEP 6: VERIFY ADMIN USERS TABLE (for future admin auth)
-- ============================================================================
-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(255),
  `password_hash` VARCHAR(255),
  `role` ENUM('admin', 'reviewer', 'viewer') DEFAULT 'admin',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- STEP 7: ACTIVITY LOG TABLE (for audit trail)
-- ============================================================================
-- Ensure admin_logs table is properly defined
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED,
  `action` VARCHAR(100),
  `table_name` VARCHAR(100),
  `record_id` INT UNSIGNED,
  `old_value` LONGTEXT,
  `new_value` LONGTEXT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================
-- Check that all required tables exist:
SHOW TABLES LIKE '%document%';
SHOW TABLES LIKE '%admin%';
SHOW TABLES LIKE '%log%';

-- Count documents by category:
-- SELECT category, COUNT(*) as total FROM documents GROUP BY category;

COMMIT;
