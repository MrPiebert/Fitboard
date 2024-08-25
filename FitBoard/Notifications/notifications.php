<?php
header('Content-Type: application/json');

// Set the default timezone to your local timezone
date_default_timezone_set('Australia/Sydney');

$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_fitboard_notifications;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '+10:00'"
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
    // Handle POST request for teachers
    $data = json_decode(file_get_contents('php://input'), true);
    $message = $data['message'] ?? '';
    $subject = $data['subject'] ?? ''; 
    $recipient = $data['recipient'] ?? ''; 

    if ($message === '' || $subject === '' || $recipient === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Message, subject, and recipient are required']);
        exit;
    }

    // Insert notification into the database
    $stmt = $pdo->prepare('INSERT INTO notifications (message, created_at, subject, recipient) VALUES (:message, NOW(), :subject, :recipient)');
    $stmt->execute(['message' => $message, 'subject' => $subject, 'recipient' => $recipient]);

    echo json_encode(['status' => 'success', 'message' => 'Notification sent']);
    
} elseif ($method == 'GET') {
    // Handle GET request for students
    $studentID = isset($_GET['studentID']) ? $_GET['studentID'] : null;

    if ($studentID) {
        // Fetch notifications where the recipient is either 'All', 'all', or matches the studentID
        $query = "SELECT * FROM notifications WHERE recipient = 'All' OR recipient = 'all' OR recipient = :studentID ORDER BY created_at DESC";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':studentID', $studentID);
        $stmt->execute();
        $notifications = $stmt->fetchAll();

        // Debugging output
        error_log("Student ID: $studentID");
        error_log("Query: $query");
        error_log("Fetched Notifications: " . print_r($notifications, true));

        echo json_encode(['status' => 'success', 'notifications' => $notifications]);
    } else {
        // If no studentID is provided, return an error message
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Student ID not provided']);
    }
    
} else {
    // Method not allowed for other HTTP methods
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
