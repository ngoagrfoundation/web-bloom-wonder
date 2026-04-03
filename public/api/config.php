<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'agrfound_maindb');
define('DB_USER', 'agrfound_dbuser');
define('DB_PASS', 'BxwV#XFZlx5z.');

// CORS - Update with your actual domain
$allowed_origins = [
    'https://agrfoundation.ngo',
    'https://www.agrfoundation.ngo',
    'https://admin.agrfoundation.ngo',
    'http://localhost:5173',
    'http://localhost:3000'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$isTrustedPreviewOrigin = false;
if ($origin) {
    $trustedPatterns = ['lovable.app', 'lovableproject.com', 'vercel.app'];
    foreach ($trustedPatterns as $pattern) {
        if (function_exists('str_contains')) {
            if (str_contains($origin, $pattern)) {
                $isTrustedPreviewOrigin = true;
                break;
            }
        } elseif (strpos($origin, $pattern) !== false) {
            $isTrustedPreviewOrigin = true;
            break;
        }
    }
}

if (in_array($origin, $allowed_origins) || $isTrustedPreviewOrigin) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// PDO Connection - tries localhost first, then 127.0.0.1
function getDB() {
    $hosts = [DB_HOST, '127.0.0.1'];
    $lastError = '';
    
    foreach ($hosts as $host) {
        try {
            $pdo = new PDO(
                "mysql:host=" . $host . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
            return $pdo;
        } catch (PDOException $e) {
            $lastError = $e->getMessage();
        }
    }
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'debug' => $lastError,
        'hint' => 'Check: 1) User agrfound_dbuser is added to agrfound_maindb with ALL PRIVILEGES in cPanel > MySQL Databases. 2) Password is correct. 3) Database exists.'
    ]);
    exit();
}

// Auth helper
function requireAdmin() {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}

// JSON body helper
function getJsonBody() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?: [];
}
