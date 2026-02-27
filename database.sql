-- DIMA Certification Backend Database Schema
-- Created for cPanel MySQL

-- ============================================================================
-- QUOTATION SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company` VARCHAR(255),
  `message` LONGTEXT,
  `status` ENUM('new', 'viewed', 'responded', 'closed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` LONGTEXT,
  `responded_by` INT UNSIGNED,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company` VARCHAR(255),
  `message` LONGTEXT,
  `status` ENUM('new', 'viewed', 'responded', 'closed') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` LONGTEXT,
  `responded_by` INT UNSIGNED,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- COMPLAINT & APPEAL SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `complaint_type` ENUM('complaint', 'appeal') NOT NULL DEFAULT 'complaint',
  `programme` ENUM('iso', 'mspo') NOT NULL,
  `iso_standard` VARCHAR(10),
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `organization` VARCHAR(255),
  `description` LONGTEXT NOT NULL,
  `evidence` LONGTEXT,
  `status` ENUM('new', 'under_review', 'responded', 'resolved', 'closed') DEFAULT 'new',
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `internal_notes` LONGTEXT,
  `assigned_to` INT UNSIGNED,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_programme` (`programme`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWNLOADABLE FORMS/LINKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `admin_forms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `form_type` VARCHAR(100) NOT NULL COMMENT 'e.g., application, questionnaire, audit_plan',
  `file_url` VARCHAR(500),
  `external_link` VARCHAR(500),
  `programme` ENUM('iso', 'mspo', 'general') DEFAULT 'general',
  `iso_standard` VARCHAR(10),
  `is_active` BOOLEAN DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` VARCHAR(50),
  INDEX `idx_programme` (`programme`),
  INDEX `idx_form_type` (`form_type`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ISO CONTENT BLOCKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `iso_content_blocks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `iso_standard` VARCHAR(10) NOT NULL COMMENT 'e.g., 9001, 14001, 45001',
  `block_key` VARCHAR(100) NOT NULL COMMENT 'e.g., overview, benefits, scope, requirements',
  `title` VARCHAR(255),
  `order_index` INT,
  `is_visible` BOOLEAN DEFAULT 1,
  `metadata` JSON COMMENT 'Additional display settings',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_standard_key` (`iso_standard`, `block_key`),
  INDEX `idx_iso_standard` (`iso_standard`),
  INDEX `idx_is_visible` (`is_visible`),
  INDEX `idx_order_index` (`order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ADMIN USERS TABLE (for future - basic auth via cPanel)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(255),
  `role` ENUM('admin', 'reviewer') DEFAULT 'admin',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ACTIVITY/AUDIT LOG TABLE
-- ============================================================================
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
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CSRF TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `csrf_tokens` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(64) UNIQUE NOT NULL,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP,
  INDEX `idx_token` (`token`),
  INDEX `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA (Optional for testing)
-- ============================================================================
INSERT INTO `admin_forms` 
  (`title`, `description`, `form_type`, `programme`, `is_active`, `display_order`, `version`) 
VALUES 
  ('ISO 9001 Application Form', 'Application form for ISO 9001 certification', 'application', 'iso', 1, 1, '1.0'),
  ('Audit Questionnaire', 'Pre-audit questionnaire document', 'questionnaire', 'iso', 1, 2, '2.1'),
  ('MSPO Initial Assessment', 'Initial assessment document for MSPO', 'assessment', 'mspo', 1, 1, '1.0');

INSERT INTO `iso_content_blocks` 
  (`iso_standard`, `block_key`, `title`, `order_index`, `is_visible`) 
VALUES 
  ('9001', 'overview', 'Quality Management Systems Overview', 1, 1),
  ('14001', 'overview', 'Environmental Management Overview', 1, 1),
  ('45001', 'overview', 'Occupational Health & Safety Overview', 1, 1);
