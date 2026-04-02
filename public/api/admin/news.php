<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM news_articles ORDER BY published_at DESC');
        echo json_encode(['data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $body = getJsonBody();
        if (empty($body['title']) || empty($body['slug'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Title and slug are required']);
            exit();
        }
        $stmt = $pdo->prepare('INSERT INTO news_articles (slug, title, excerpt, content, image, author, category, read_time, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $body['slug'],
            $body['title'],
            $body['excerpt'] ?? '',
            $body['content'] ?? '',
            $body['image'] ?? '',
            $body['author'] ?? 'AGR Foundation',
            $body['category'] ?? 'announcement',
            (int)($body['read_time'] ?? 3),
            (int)($body['is_published'] ?? 1),
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $body = getJsonBody();
        if (empty($body['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }
        $fields = [];
        $values = [];
        foreach (['slug', 'title', 'excerpt', 'content', 'image', 'author', 'category', 'read_time', 'is_published'] as $f) {
            if (isset($body[$f])) {
                $fields[] = "$f = ?";
                $values[] = $f === 'read_time' || $f === 'is_published' ? (int)$body[$f] : $body[$f];
            }
        }
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit();
        }
        $values[] = $body['id'];
        $stmt = $pdo->prepare('UPDATE news_articles SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }
        $stmt = $pdo->prepare('DELETE FROM news_articles WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
