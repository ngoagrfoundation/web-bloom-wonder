<?php
require_once __DIR__ . '/../config.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$folder = $_POST['folder'] ?? 'general';
$allowedFolders = ['events', 'news', 'gallery', 'general', 'reels'];
if (!in_array($folder, $allowedFolders)) {
    $folder = 'general';
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded or upload error']);
    exit();
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, MP4, WebM']);
    exit();
}

// 50MB limit for videos, 5MB for images
$isVideo = strpos($mimeType, 'video/') === 0;
$maxSize = $isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

if ($file['size'] > $maxSize) {
    $maxMB = $maxSize / (1024 * 1024);
    http_response_code(400);
    echo json_encode(['error' => "File too large. Maximum {$maxMB}MB"]);
    exit();
}

$uploadDir = __DIR__ . "/../../uploads/$folder/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: ($isVideo ? 'mp4' : 'jpg');
$filename = uniqid() . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $publicPath = "/uploads/$folder/$filename";
    echo json_encode(['success' => true, 'path' => $publicPath, 'url' => $publicPath]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
}
