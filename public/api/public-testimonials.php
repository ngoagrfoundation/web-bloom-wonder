<?php
require_once __DIR__ . '/config.php';
$db = getDB();
$stmt = $db->query("SELECT id, quote, name, role, photo FROM testimonials WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC");
echo json_encode(['data' => $stmt->fetchAll()]);
