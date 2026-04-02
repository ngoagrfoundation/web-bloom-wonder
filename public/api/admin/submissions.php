<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $formType = $_GET['form_type'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    
    $where = '';
    $params = [];
    if ($formType) {
        $where = 'WHERE form_type = ?';
        $params[] = $formType;
    }
    
    // Count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM form_submissions $where");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();
    
    // Data
    $params[] = $limit;
    $params[] = $offset;
    $stmt = $pdo->prepare("SELECT * FROM form_submissions $where ORDER BY submitted_at DESC LIMIT ? OFFSET ?");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    
    // Decode JSON data
    foreach ($rows as &$row) {
        $row['data'] = json_decode($row['data'], true);
    }
    
    echo json_encode([
        'data' => $rows,
        'total' => intval($total),
        'page' => $page,
        'limit' => $limit,
        'pages' => ceil($total / $limit)
    ]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit();
    }
    $stmt = $pdo->prepare("DELETE FROM form_submissions WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
