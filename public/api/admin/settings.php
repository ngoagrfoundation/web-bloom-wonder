<?php
require_once __DIR__ . '/../config.php';
requireAdmin();
$db = getDB();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
        $settings = [];
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        echo json_encode(['data' => $settings]);
        break;

    case 'PUT':
        $data = getJsonBody();
        $stmt = $db->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        foreach ($data as $key => $value) {
            $stmt->execute([$key, $value]);
        }
        echo json_encode(['success' => true]);
        break;
}
