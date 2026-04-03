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
        status VARCHAR(20) DEFAULT 'new',
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
        tags VARCHAR(500) DEFAULT '',
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
    )",

    "CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        message TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS volunteer_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        location VARCHAR(255),
        initiatives TEXT,
        availability TEXT,
        experience TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS partner_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_name VARCHAR(255),
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        organization_type VARCHAR(100),
        partnership_interest TEXT,
        message TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS adopt_student_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sponsor_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        city VARCHAR(255),
        grade_level VARCHAR(100),
        duration VARCHAR(100),
        message TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS report_challenge_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        location VARCHAR(255),
        challenge_type VARCHAR(100),
        description TEXT,
        people_affected VARCHAR(100),
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS sanskrit_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        mobile VARCHAR(20),
        address TEXT,
        age VARCHAR(10),
        batch VARCHAR(50),
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS dental_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        mobile VARCHAR(20),
        address TEXT,
        problem TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_title VARCHAR(255),
        event_category VARCHAR(100),
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        participants INT DEFAULT 1,
        special_requirements TEXT,
        status VARCHAR(20) DEFAULT 'new',
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        image VARCHAR(500),
        author VARCHAR(100),
        category VARCHAR(50),
        read_time INT DEFAULT 5,
        is_published TINYINT(1) DEFAULT 0,
        published_at TIMESTAMP NULL,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(500) NOT NULL,
        thumbnail VARCHAR(500),
        description TEXT,
        is_published TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quote TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        photo VARCHAR(500),
        is_published TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500),
        website VARCHAR(500),
        description TEXT,
        is_published TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500),
        website VARCHAR(500),
        tier VARCHAR(50) DEFAULT 'silver',
        is_published TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
