-- ============================================================================
-- CERTIFICATION AGREEMENT TABLE
-- ============================================================================
-- Simple table to store the certification agreement PDF
-- Admin can upload/replace the PDF

USE `dima_production`;

CREATE TABLE IF NOT EXISTS `certification_agreement` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL DEFAULT 'DMC/ISO/QCA Quotation Certification Agreement',
  `description` TEXT,
  `file_path` VARCHAR(500) COMMENT 'Path to PDF: /uploads/documents/filename.pdf',
  `file_name` VARCHAR(255),
  `file_size` INT UNSIGNED COMMENT 'Size in bytes',
  `version` VARCHAR(50) DEFAULT '1.0',
  `issue_date` DATE,
  `updated_by` INT UNSIGNED,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default record (no PDF yet - admin will upload)
INSERT INTO `certification_agreement` (`id`, `title`, `description`, `version`, `issue_date`)
VALUES (1, 'DMC/ISO/QCA Quotation Certification Agreement', 
        'This document covers all aspects of the certification process including general conditions, payment terms, rights and duties of client organizations, post-certification terms, confidentiality, and dispute resolution.',
        'Issue 1', '2024-10-17')
ON DUPLICATE KEY UPDATE `id` = `id`;
