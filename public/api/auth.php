<?php
require_once __DIR__ . '/config.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'POST' && $action === 'login') {
    $data = getJsonBody();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        exit();
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        echo json_encode(['success' => true, 'username' => $user['username']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    
} elseif ($method === 'POST' && $action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    
} elseif ($method === 'GET' && $action === 'check') {
    if (isset($_SESSION['admin_id'])) {
        echo json_encode(['authenticated' => true, 'username' => $_SESSION['admin_username']]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    
} elseif ($method === 'POST' && $action === 'change-password') {
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $data = getJsonBody();
    $current = $data['current_password'] ?? '';
    $newPass = $data['new_password'] ?? '';
    
    if (strlen($newPass) < 8) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 8 characters']);
        exit();
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $user = $stmt->fetch();
    
    if (!password_verify($current, $user['password_hash'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Current password is incorrect']);
        exit();
    }
    
    $hash = password_hash($newPass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hash, $_SESSION['admin_id']]);
    echo json_encode(['success' => true]);
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
