<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();

try {
    $stmt = $pdo->query("SELECT id, name, logo, website_url FROM partners WHERE is_published = 1 ORDER BY sort_order ASC, id ASC");
    $data = $stmt->fetchAll();
    echo json_encode(['data' => $data]);
} catch (PDOException $e) {
    echo json_encode(['data' => [], 'note' => 'Table may not exist yet']);
}
