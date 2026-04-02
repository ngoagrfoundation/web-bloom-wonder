<?php
// ONE-TIME SETUP SCRIPT - DELETE AFTER RUNNING
require_once __DIR__ . '/config.php';

$pdo = getDB();

$queries = [
    "CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS form_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_type VARCHAR(50) NOT NULL,
        data JSON NOT NULL,
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        razorpay_payment_id VARCHAR(100) UNIQUE,
        donor_name VARCHAR(100),
        donor_email VARCHAR(255),
        donor_phone VARCHAR(20),
        amount DECIMAL(10,2) NOT NULL,
        donation_type VARCHAR(50),
        pan_number VARCHAR(20),
        status VARCHAR(20) DEFAULT 'success',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        src VARCHAR(500) NOT NULL,
        alt VARCHAR(255),
        category VARCHAR(50),
        caption TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE,
        time VARCHAR(50),
        location VARCHAR(500),
        category VARCHAR(50),
        image VARCHAR(500),
        attendees INT DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )"
];

try {
    foreach ($queries as $sql) {
        $pdo->exec($sql);
    }
    
    // Create default admin user (username: admin, password: AGR@admin2025)
    $hash = password_hash('AGR@admin2025', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)");
    $stmt->execute(['admin', $hash]);
    
    echo json_encode([
        'success' => true,
        'message' => 'All tables created successfully. Default admin: admin / AGR@admin2025. DELETE THIS FILE NOW!'
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
