<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

$pdo = getDB();

$tableMap = [
    'contact' => ['table' => 'contact_submissions', 'columns' => ['id', 'name', 'email', 'phone', 'message', 'ip_address', 'submitted_at']],
    'volunteer' => ['table' => 'volunteer_submissions', 'columns' => ['id', 'full_name', 'email', 'phone', 'location', 'initiatives', 'availability', 'experience', 'ip_address', 'submitted_at']],
    'partner' => ['table' => 'partner_submissions', 'columns' => ['id', 'organization_name', 'contact_person', 'email', 'phone', 'organization_type', 'partnership_interest', 'message', 'ip_address', 'submitted_at']],
    'adopt_student' => ['table' => 'adopt_student_submissions', 'columns' => ['id', 'sponsor_name', 'email', 'phone', 'city', 'grade_level', 'duration', 'message', 'ip_address', 'submitted_at']],
    'report_challenge' => ['table' => 'report_challenge_submissions', 'columns' => ['id', 'name', 'phone', 'email', 'location', 'challenge_type', 'description', 'people_affected', 'ip_address', 'submitted_at']],
    'sanskrit_registration' => ['table' => 'sanskrit_registrations', 'columns' => ['id', 'name', 'mobile', 'address', 'age', 'batch', 'ip_address', 'submitted_at']],
    'dental_registration' => ['table' => 'dental_registrations', 'columns' => ['id', 'name', 'mobile', 'address', 'problem', 'ip_address', 'submitted_at']],
    'event_registration' => ['table' => 'event_registrations', 'columns' => ['id', 'event_title', 'event_category', 'full_name', 'email', 'phone', 'participants', 'special_requirements', 'ip_address', 'submitted_at']],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $formType = $_GET['form_type'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    if ($formType && isset($tableMap[$formType])) {
        // Query specific table
        $info = $tableMap[$formType];
        $table = $info['table'];
        $columns = $info['columns'];

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM `$table`");
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT * FROM `$table` ORDER BY submitted_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
        $rows = $stmt->fetchAll();

        // Add form_type to each row
        foreach ($rows as &$row) {
            $row['form_type'] = $formType;
        }

        echo json_encode([
            'data' => $rows,
            'columns' => $columns,
            'total' => intval($total),
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]);
    } else {
        // Query all tables and merge
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
            } catch (PDOException $e) {
                // Table might not exist yet, skip
                continue;
            }
        }

        // Sort all by submitted_at descending
        usort($allRows, function($a, $b) {
            return strtotime($b['submitted_at'] ?? '0') - strtotime($a['submitted_at'] ?? '0');
        });

        // Paginate
        $total = count($allRows);
        $paged = array_slice($allRows, $offset, $limit);

        echo json_encode([
            'data' => $paged,
            'columns' => ['id', 'form_type', 'submitted_at'],
            'total' => $grandTotal,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($grandTotal / $limit)
        ]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
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
