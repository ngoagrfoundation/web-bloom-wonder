<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = getJsonBody();
$formType = $data['form_type'] ?? 'unknown';
$formData = $data['data'] ?? $data;

// Remove form_type from data if present
if (isset($formData['form_type'])) {
    unset($formData['form_type']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '';

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO form_submissions (form_type, data, ip_address) VALUES (?, ?, ?)");
    $stmt->execute([$formType, json_encode($formData), $ip]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save submission']);
}
