-- ============================================================
-- Homepage Gallery Images Migration
-- Run this on the dima_production database
-- ============================================================

-- Create homepage_images table
CREATE TABLE IF NOT EXISTS homepage_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section ENUM('hero', 'gallery') NOT NULL DEFAULT 'gallery',
    title VARCHAR(255) NOT NULL DEFAULT '',
    alt_text VARCHAR(255) NOT NULL DEFAULT '',
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section_status (section, status),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
