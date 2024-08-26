<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Delete Year 12 students
    $deleteStmt = $pdo->prepare("DELETE FROM students WHERE year = 12");
    $deleteStmt->execute();

    // Increment year for all other students
    $updateStmt = $pdo->prepare("UPDATE students SET year = year + 1 WHERE year < 12");
    $updateStmt->execute();

    $response = ['status' => 'success', 'message' => 'School year updated successfully.'];
} catch (PDOException $e) {
    $response = ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
