<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC");
    echo json_encode(['data' => $stmt->fetchAll()]);
    
} elseif ($method === 'POST') {
    if (isset($_FILES['image'])) {
        $uploadDir = __DIR__ . '/../../uploads/gallery/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $file = $_FILES['image'];
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        
        if (!in_array($file['type'], $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Allowed: JPG, PNG, WebP, GIF']);
            exit();
        }
        
        if ($file['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['error' => 'File too large. Max 5MB']);
            exit();
        }
        
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('gallery_') . '.' . $ext;
        $filepath = $uploadDir . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload file']);
            exit();
        }
        
        $src = '/uploads/gallery/' . $filename;
        $alt = $_POST['alt'] ?? '';
        $category = $_POST['category'] ?? '';
        $caption = $_POST['caption'] ?? '';
        $tags = $_POST['tags'] ?? '';
        $sortOrder = intval($_POST['sort_order'] ?? 0);
        
        $stmt = $pdo->prepare("INSERT INTO gallery_images (src, alt, category, caption, tags, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$src, $alt, $category, $caption, $tags, $sortOrder]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'src' => $src]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No image file provided']);
    }
    
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
    foreach (['alt', 'category', 'caption', 'tags', 'sort_order'] as $field) {
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
    $stmt = $pdo->prepare("UPDATE gallery_images SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);
    echo json_encode(['success' => true]);
    
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit();
    }
    
    $stmt = $pdo->prepare("SELECT src FROM gallery_images WHERE id = ?");
    $stmt->execute([$id]);
    $image = $stmt->fetch();
    
    if ($image && file_exists(__DIR__ . '/../../' . $image['src'])) {
        unlink(__DIR__ . '/../../' . $image['src']);
    }
    
    $stmt = $pdo->prepare("DELETE FROM gallery_images WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
