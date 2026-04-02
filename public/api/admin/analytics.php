<?php
require_once __DIR__ . '/../config.php';
requireAdmin();
$db = getDB();

$type = $_GET['type'] ?? '';

switch ($type) {
    case 'submissions':
        // Daily submission counts for last 30 days across all form tables
        $tables = [
            'contact_submissions' => 'submitted_at',
            'volunteer_submissions' => 'submitted_at',
            'partner_submissions' => 'submitted_at',
            'adopt_student_submissions' => 'submitted_at',
            'report_challenge_submissions' => 'submitted_at',
            'sanskrit_registrations' => 'submitted_at',
            'dental_registrations' => 'submitted_at',
            'event_registrations' => 'submitted_at',
        ];
        
        $unionParts = [];
        foreach ($tables as $table => $col) {
            $unionParts[] = "SELECT DATE($col) as day FROM $table WHERE $col >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        }
        $union = implode(' UNION ALL ', $unionParts);
        
        $stmt = $db->query("SELECT day, COUNT(*) as count FROM ($union) combined GROUP BY day ORDER BY day");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Fill in missing days with 0
        $result = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $found = false;
            foreach ($data as $row) {
                if ($row['day'] === $date) {
                    $result[] = ['date' => $date, 'count' => (int)$row['count']];
                    $found = true;
                    break;
                }
            }
            if (!$found) $result[] = ['date' => $date, 'count' => 0];
        }
        echo json_encode(['data' => $result]);
        break;

    case 'donations':
        // Monthly donation totals for last 12 months
        $stmt = $db->query("
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
                   COALESCE(SUM(amount), 0) as total,
                   COUNT(*) as count
            FROM donations 
            WHERE status = 'success' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY month 
            ORDER BY month
        ");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = date('Y-m', strtotime("-$i months"));
            $found = false;
            foreach ($data as $row) {
                if ($row['month'] === $month) {
                    $result[] = ['month' => $month, 'total' => (float)$row['total'], 'count' => (int)$row['count']];
                    $found = true;
                    break;
                }
            }
            if (!$found) $result[] = ['month' => $month, 'total' => 0, 'count' => 0];
        }
        echo json_encode(['data' => $result]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type. Use ?type=submissions or ?type=donations']);
}
