-- Public Complaint & Civic Issue Tracking System Schema
-- PDEU CSE Minor Project 2026

CREATE TABLE IF NOT EXISTS departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  head_email VARCHAR(100),
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'admin', 'staff') NOT NULL DEFAULT 'citizen',
  department_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaints (
  complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location_address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  image_url VARCHAR(255) NULL,
  priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  status ENUM('SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'SUBMITTED',
  department_id INT NULL,
  assigned_staff_id INT NULL,
  resolution_image_url VARCHAR(255) NULL,
  resolution_notes TEXT NULL,
  citizen_rating INT NULL,
  citizen_feedback TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_by INT NULL,
  notes TEXT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS status_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  comment TEXT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;
