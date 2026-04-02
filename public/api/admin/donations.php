<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    
    $status = $_GET['status'] ?? '';
    $type = $_GET['type'] ?? '';
    $search = $_GET['search'] ?? '';
    $dateFrom = $_GET['date_from'] ?? '';
    $dateTo = $_GET['date_to'] ?? '';

    $where = [];
    $params = [];

    if ($status) {
        $where[] = "status = ?";
        $params[] = $status;
    }
    if ($type) {
        $where[] = "donation_type = ?";
        $params[] = $type;
    }
    if ($search) {
        $where[] = "(donor_name LIKE ? OR donor_email LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($dateFrom) {
        $where[] = "created_at >= ?";
        $params[] = $dateFrom;
    }
    if ($dateTo) {
        $where[] = "created_at <= ?";
        $params[] = $dateTo . ' 23:59:59';
    }

    $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM donations $whereSQL");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();
    
    // Stats (always for successful)
    $stats = $pdo->query("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount FROM donations WHERE status = 'success'")->fetch();
    
    // Data
    $stmt = $pdo->prepare("SELECT * FROM donations $whereSQL ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $allParams = array_merge($params, [$limit, $offset]);
    $stmt->execute($allParams);
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
