<?php
require_once __DIR__ . '/config.php';
$db = getDB();
$stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
$settings = [];
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
echo json_encode(['data' => $settings]);
