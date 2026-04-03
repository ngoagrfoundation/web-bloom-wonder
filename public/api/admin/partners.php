<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM partners ORDER BY sort_order ASC, id ASC");
    echo json_encode(['data' => $stmt->fetchAll()]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonBody();
    $stmt = $pdo->prepare("INSERT INTO partners (name, logo, website_url, sort_order, is_published) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$data['name'] ?? '', $data['logo'] ?? '', $data['website_url'] ?? '', $data['sort_order'] ?? 0, $data['is_published'] ?? 1]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonBody();
    if (empty($data['id'])) { http_response_code(400); echo json_encode(['error' => 'ID required']); exit(); }
    $fields = []; $params = [];
    foreach (['name', 'logo', 'website_url', 'sort_order', 'is_published'] as $f) {
        if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
    }
    if ($fields) { $params[] = $data['id']; $pdo->prepare("UPDATE partners SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params); }
    echo json_encode(['success' => true]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required']); exit(); }
    $pdo->prepare("DELETE FROM partners WHERE id = ?")->execute([$id]);
    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
