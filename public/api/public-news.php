<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$pdo = getDB();

// Single article by slug
if (isset($_GET['slug'])) {
    $stmt = $pdo->prepare('SELECT * FROM news_articles WHERE slug = ? AND is_published = 1 LIMIT 1');
    $stmt->execute([$_GET['slug']]);
    $article = $stmt->fetch();
    if ($article) {
        echo json_encode(['data' => $article]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Article not found']);
    }
    exit();
}

// List published articles
$limit = min((int)($_GET['limit'] ?? 50), 100);
$stmt = $pdo->prepare('SELECT * FROM news_articles WHERE is_published = 1 ORDER BY published_at DESC LIMIT ?');
$stmt->execute([$limit]);
$articles = $stmt->fetchAll();

echo json_encode(['data' => $articles]);
