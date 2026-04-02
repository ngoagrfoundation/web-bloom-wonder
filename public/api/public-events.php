<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->query('SELECT * FROM events ORDER BY date DESC, created_at DESC');
$events = $stmt->fetchAll();

echo json_encode(['data' => $events]);
