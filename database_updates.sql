-- ============================================================================
-- MSPO CONTENT MANAGEMENT SCHEMA UPDATES
-- Database migration for DIMA Certification Admin
-- ============================================================================

-- ============================================================================
-- MSPO PUBLIC NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `mspo_notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `effective_date` DATE,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `published_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_published_at` (`published_at`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MSPO PUBLIC SUMMARY REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `mspo_public_summary_reports` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `report_title` VARCHAR(255) NOT NULL,
  `summary_text` LONGTEXT NOT NULL,
  `year` YEAR,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `published_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_year` (`year`),
  INDEX `idx_published_at` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOWNLOADABLE FORMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS `downloadable_forms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `form_name` VARCHAR(255) NOT NULL,
  `form_type` ENUM('Application Form', 'Questionnaire for Self Assessment', 'Other') NOT NULL,
  `programme` ENUM('MSPO', 'ISO9001', 'ISO14001', 'ISO45001', 'General') NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `version_label` VARCHAR(50),
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_programme` (`programme`),
  INDEX `idx_form_type` (`form_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================
INSERT INTO `mspo_notifications` 
  (`title`, `content`, `effective_date`, `status`, `published_at`) 
VALUES 
  ('Q1 2026 Updates', 'Important updates for MSPO certification program. Please review the new documentation and guidelines available on the website.', '2026-03-01', 'published', NOW()),
  ('New Documentation Available', 'Check our updated forms and guidelines for certification applicants', '2026-02-15', 'published', NOW()),
  ('System Maintenance Notice', 'Our systems will undergo scheduled maintenance on Sunday. Services may be temporarily unavailable.', NOW(), 'draft', NULL);

INSERT INTO `mspo_public_summary_reports` 
  (`report_title`, `summary_text`, `year`, `status`, `published_at`) 
VALUES 
  ('2025 MSPO Summary Report', 'Overview of MSPO certifications, audit activities, and key statistics for the year 2025. This report includes information on certification holders, audit programs, and compliance metrics.', 2025, 'published', NOW()),
  ('2024 Annual Report', 'Comprehensive year-end summary from 2024 operations, including audit results, certification updates, and program effectiveness metrics.', 2024, 'published', NOW()),
  ('2023 Review Document', 'Historical review of 2023 operations for reference and compliance documentation.', 2023, 'published', NOW());

INSERT INTO `downloadable_forms` 
  (`form_name`, `form_type`, `programme`, `file_path`, `version_label`, `status`) 
VALUES 
  ('MSPO Application Form', 'Application Form', 'MSPO', '/uploads/forms/mspo_application_v1.pdf', 'v1.0', 'active'),
  ('ISO 9001 Questionnaire', 'Questionnaire for Self Assessment', 'ISO9001', '/uploads/forms/iso9001_questionnaire_v2.pdf', 'v2.1', 'active'),
  ('ISO 14001 Audit Plan Template', 'Questionnaire for Self Assessment', 'ISO14001', '/uploads/forms/iso14001_audit_plan.pdf', 'v1.5', 'active'),
  ('ISO 45001 Self Assessment', 'Questionnaire for Self Assessment', 'ISO45001', '/uploads/forms/iso45001_self_assessment.pdf', 'v1.0', 'active'),
  ('General Information Sheet', 'Other', 'General', '/uploads/forms/general_info_sheet.pdf', 'v1.0', 'active');
