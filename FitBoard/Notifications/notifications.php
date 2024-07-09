<?php
header('Content-Type: application/json');

// Set the default timezone to your local timezone
date_default_timezone_set('Australia/Sydney'); // Adjust this to your timezone

$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_fitboard_notifications;charset=utf8';
$username = 'if0_36607942'; // Your InfinityFree control panel username
$password = 'Lf1knlji5fBcBd'; // Your InfinityFree control panel password
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '+10:00'" // Set session timezone
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $message = $data['message'] ?? '';

    if ($message === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Message is required']);
        exit;
    }

    // Use current timestamp in SQL
    $stmt = $pdo->prepare('INSERT INTO notifications (message, created_at) VALUES (:message, NOW())');
    $stmt->execute(['message' => $message]);

    echo json_encode(['status' => 'success', 'message' => 'Notification sent']);
} elseif ($method == 'GET') {
    $stmt = $pdo->query('SELECT * FROM notifications ORDER BY created_at DESC');
    $notifications = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'notifications' => $notifications]);
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
