<?php
header('Content-Type: application/json');

// Database connection
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';
$pdo = new PDO($dsn, $username, $password);

// Get the JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['ids']) && is_array($data['ids'])) {
    $ids = $data['ids'];

    // Prepare the SQL statement with placeholders
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "DELETE FROM students WHERE id IN ($placeholders)";
    $stmt = $pdo->prepare($sql);

    // Execute the statement
    if ($stmt->execute($ids)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete students.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request data.']);
}
?>
