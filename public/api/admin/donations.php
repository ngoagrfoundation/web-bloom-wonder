<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    
    // Count
    $total = $pdo->query("SELECT COUNT(*) FROM donations")->fetchColumn();
    
    // Stats
    $stats = $pdo->query("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount FROM donations WHERE status = 'success'")->fetch();
    
    // Data
    $stmt = $pdo->prepare("SELECT * FROM donations ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $stmt->execute([$limit, $offset]);
    $rows = $stmt->fetchAll();
    
    echo json_encode([
        'data' => $rows,
        'total' => intval($total),
        'page' => $page,
        'limit' => $limit,
        'pages' => ceil($total / $limit),
        'stats' => [
            'total_donations' => intval($stats['count']),
            'total_amount' => floatval($stats['total_amount'])
        ]
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
