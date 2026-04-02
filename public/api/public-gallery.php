<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->query('SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC');
$images = $stmt->fetchAll();

echo json_encode(['data' => $images]);
