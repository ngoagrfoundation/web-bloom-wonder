<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM events ORDER BY date DESC, created_at DESC");
    echo json_encode(['data' => $stmt->fetchAll()]);
    
} elseif ($method === 'POST') {
    $data = getJsonBody();
    
    $required = ['title'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit();
        }
    }
    
    $stmt = $pdo->prepare("INSERT INTO events (title, description, date, time, location, category, image, attendees, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'],
        $data['description'] ?? '',
        $data['date'] ?? null,
        $data['time'] ?? '',
        $data['location'] ?? '',
        $data['category'] ?? '',
        $data['image'] ?? '',
        intval($data['attendees'] ?? 0),
        intval($data['is_featured'] ?? 0)
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    
} elseif ($method === 'PUT') {
    $data = getJsonBody();
    $id = $data['id'] ?? '';
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit();
    }
    
    $fields = [];
    $params = [];
    foreach (['title', 'description', 'date', 'time', 'location', 'category', 'image', 'attendees', 'is_featured'] as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $params[] = $data[$field];
        }
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit();
    }
    
    $params[] = $id;
    $stmt = $pdo->prepare("UPDATE events SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);
    echo json_encode(['success' => true]);
    
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit();
    }
    $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
