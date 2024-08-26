<?php
// delete_notification.php

// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_fitboard_notifications;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the notification ID from the POST request
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];

    // Prepare and execute the delete query
    $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = :id");
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete notification.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
