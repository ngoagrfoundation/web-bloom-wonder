<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = getJsonBody();

$required = ['razorpay_payment_id', 'amount'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO donations (razorpay_payment_id, donor_name, donor_email, donor_phone, amount, donation_type, pan_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['razorpay_payment_id'],
        $data['donor_name'] ?? '',
        $data['donor_email'] ?? '',
        $data['donor_phone'] ?? '',
        $data['amount'],
        $data['donation_type'] ?? 'one-time',
        $data['pan_number'] ?? '',
        $data['status'] ?? 'success'
    ]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => true, 'message' => 'Already recorded']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to record donation']);
    }
}
