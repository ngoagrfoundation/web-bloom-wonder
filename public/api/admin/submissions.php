<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

$tableMap = [
    'contact' => ['table' => 'contact_submissions', 'columns' => ['id', 'name', 'email', 'phone', 'message', 'status', 'ip_address', 'submitted_at']],
    'volunteer' => ['table' => 'volunteer_submissions', 'columns' => ['id', 'full_name', 'email', 'phone', 'location', 'initiatives', 'availability', 'experience', 'status', 'ip_address', 'submitted_at']],
    'partner' => ['table' => 'partner_submissions', 'columns' => ['id', 'organization_name', 'contact_person', 'email', 'phone', 'organization_type', 'partnership_interest', 'message', 'status', 'ip_address', 'submitted_at']],
    'adopt_student' => ['table' => 'adopt_student_submissions', 'columns' => ['id', 'sponsor_name', 'email', 'phone', 'city', 'grade_level', 'duration', 'message', 'status', 'ip_address', 'submitted_at']],
    'report_challenge' => ['table' => 'report_challenge_submissions', 'columns' => ['id', 'name', 'phone', 'email', 'location', 'challenge_type', 'description', 'people_affected', 'status', 'ip_address', 'submitted_at']],
    'sanskrit_registration' => ['table' => 'sanskrit_registrations', 'columns' => ['id', 'name', 'mobile', 'address', 'age', 'batch', 'status', 'ip_address', 'submitted_at']],
    'dental_registration' => ['table' => 'dental_registrations', 'columns' => ['id', 'name', 'mobile', 'address', 'problem', 'status', 'ip_address', 'submitted_at']],
    'event_registration' => ['table' => 'event_registrations', 'columns' => ['id', 'event_title', 'event_category', 'full_name', 'email', 'phone', 'participants', 'special_requirements', 'status', 'ip_address', 'submitted_at']],
];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT') {
    // Update submission status
    $body = getJsonBody();
    $id = $body['id'] ?? '';
    $formType = $body['form_type'] ?? '';
    $status = $body['status'] ?? '';

    if (!$id || !$formType || !isset($tableMap[$formType]) || !in_array($status, ['new', 'reviewed', 'closed'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid ID, form_type, and status (new/reviewed/closed) required']);
        exit();
    }

    $table = $tableMap[$formType]['table'];
    $stmt = $pdo->prepare("UPDATE `$table` SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    echo json_encode(['success' => true]);
    exit();
}

if ($method === 'GET') {
    // Check if requesting counts only
    if (isset($_GET['counts'])) {
        $counts = [];
        foreach ($tableMap as $type => $info) {
            try {
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM `{$info['table']}`");
                $stmt->execute();
                $counts[$type] = intval($stmt->fetchColumn());
            } catch (PDOException $e) {
                $counts[$type] = 0;
            }
        }
        echo json_encode(['counts' => $counts]);
        exit();
    }

    $formType = $_GET['form_type'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? '';
    $dateFrom = $_GET['date_from'] ?? '';
    $dateTo = $_GET['date_to'] ?? '';
    $statusFilter = $_GET['status'] ?? '';

    if ($formType && isset($tableMap[$formType])) {
        $info = $tableMap[$formType];
        $table = $info['table'];

        $where = [];
        $params = [];

        if ($search) {
            $searchCols = array_filter($info['columns'], fn($c) => !in_array($c, ['id', 'ip_address', 'submitted_at', 'status']));
            $searchParts = [];
            foreach ($searchCols as $col) {
                $searchParts[] = "`$col` LIKE ?";
                $params[] = "%$search%";
            }
            if ($searchParts) $where[] = '(' . implode(' OR ', $searchParts) . ')';
        }

        if ($dateFrom) { $where[] = 'submitted_at >= ?'; $params[] = $dateFrom . ' 00:00:00'; }
        if ($dateTo) { $where[] = 'submitted_at <= ?'; $params[] = $dateTo . ' 23:59:59'; }
        if ($statusFilter) { $where[] = 'status = ?'; $params[] = $statusFilter; }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM `$table` $whereClause");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        $params[] = $limit;
        $params[] = $offset;
        $stmt = $pdo->prepare("SELECT * FROM `$table` $whereClause ORDER BY submitted_at DESC LIMIT ? OFFSET ?");
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        foreach ($rows as &$row) { $row['form_type'] = $formType; }

        echo json_encode([
            'data' => $rows,
            'columns' => $info['columns'],
            'total' => intval($total),
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]);
    } else {
        $allRows = [];
        $grandTotal = 0;

        foreach ($tableMap as $type => $info) {
            $table = $info['table'];
            try {
                $countStmt = $pdo->prepare("SELECT COUNT(*) FROM `$table`");
                $countStmt->execute();
                $count = intval($countStmt->fetchColumn());
                $grandTotal += $count;

                $stmt = $pdo->prepare("SELECT *, ? as form_type FROM `$table` ORDER BY submitted_at DESC LIMIT 100");
                $stmt->execute([$type]);
                $rows = $stmt->fetchAll();
                $allRows = array_merge($allRows, $rows);
            } catch (PDOException $e) { continue; }
        }

        usort($allRows, function($a, $b) {
            return strtotime($b['submitted_at'] ?? '0') - strtotime($a['submitted_at'] ?? '0');
        });

        $total = count($allRows);
        $paged = array_slice($allRows, $offset, $limit);

        echo json_encode([
            'data' => $paged,
            'columns' => ['id', 'form_type', 'status', 'submitted_at'],
            'total' => $grandTotal,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($grandTotal / $limit)
        ]);
    }

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    $formType = $_GET['form_type'] ?? '';

    if (!$id || !$formType || !isset($tableMap[$formType])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID and valid form_type required']);
        exit();
    }

    $table = $tableMap[$formType]['table'];
    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
