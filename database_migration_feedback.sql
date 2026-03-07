-- Database Migration: Add feedback_messages table
-- Run this in phpMyAdmin or MySQL CLI

CREATE TABLE IF NOT EXISTS feedback_messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    feedback_type VARCHAR(100) NOT NULL COMMENT 'Type of feedback (e.g., General Feedback, Suggestion, Complaint, Other)',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_type VARCHAR(255) DEFAULT NULL COMMENT 'Service type related to feedback',
    comment TEXT NOT NULL,
    status ENUM('new', 'read', 'responded', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_feedback_type (feedback_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
