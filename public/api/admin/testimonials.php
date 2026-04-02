<?php
require_once __DIR__ . '/../config.php';
requireAdmin();
$db = getDB();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC");
        echo json_encode(['data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = getJsonBody();
        $stmt = $db->prepare("INSERT INTO testimonials (quote, name, role, photo, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['quote'] ?? '',
            $data['name'] ?? '',
            $data['role'] ?? '',
            $data['photo'] ?? '',
            $data['is_published'] ?? 1,
            $data['sort_order'] ?? 0,
        ]);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
        break;

    case 'PUT':
        $data = getJsonBody();
        if (empty($data['id'])) { http_response_code(400); echo json_encode(['error' => 'ID required']); exit; }
        $fields = [];
        $values = [];
        foreach (['quote', 'name', 'role', 'photo', 'is_published', 'sort_order'] as $f) {
            if (isset($data[$f])) { $fields[] = "$f = ?"; $values[] = $data[$f]; }
        }
        if ($fields) {
            $values[] = $data['id'];
            $db->prepare("UPDATE testimonials SET " . implode(', ', $fields) . " WHERE id = ?")->execute($values);
        }
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required']); exit; }
        $db->prepare("DELETE FROM testimonials WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
