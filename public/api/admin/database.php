<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

$allowedTables = [
    'contact_submissions', 'volunteer_submissions', 'partner_submissions',
    'adopt_student_submissions', 'report_challenge_submissions',
    'sanskrit_registrations', 'dental_registrations', 'event_registrations',
    'donations', 'gallery_images', 'events', 'news_articles', 'admin_users'
];

$action = $_GET['action'] ?? '';

if ($action === 'tables') {
    $result = [];
    foreach ($allowedTables as $table) {
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `$table`");
            $stmt->execute();
            $count = intval($stmt->fetchColumn());
            $result[] = ['name' => $table, 'rows' => $count];
        } catch (PDOException $e) {
            $result[] = ['name' => $table, 'rows' => 0, 'error' => 'Table not found'];
        }
    }
    echo json_encode(['data' => $result]);
    exit();
}

$table = $_GET['table'] ?? '';
if (!$table || !in_array($table, $allowedTables)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing table name']);
    exit();
}

$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(10, intval($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;
$search = $_GET['search'] ?? '';

try {
    // Get total count
    if ($search) {
        // Get column names first
        $colStmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
        $colStmt->execute();
        $columns = $colStmt->fetchAll(PDO::FETCH_COLUMN);
        
        $whereParts = [];
        $params = [];
        foreach ($columns as $col) {
            $whereParts[] = "`$col` LIKE ?";
            $params[] = "%$search%";
        }
        $where = implode(' OR ', $whereParts);
        
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM `$table` WHERE $where");
        $countStmt->execute($params);
        $total = intval($countStmt->fetchColumn());
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE $where ORDER BY id DESC LIMIT ? OFFSET ?");
        $stmt->execute($params);
    } else {
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM `$table`");
        $countStmt->execute();
        $total = intval($countStmt->fetchColumn());
        
        $stmt = $pdo->prepare("SELECT * FROM `$table` ORDER BY id DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
    }
    
    $rows = $stmt->fetchAll();
    
    // Get column names
    $colStmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
    $colStmt->execute();
    $columns = $colStmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        'data' => $rows,
        'columns' => $columns,
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
        'pages' => ceil($total / $limit)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'debug' => $e->getMessage()]);
}