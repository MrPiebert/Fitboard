<?php
// fetch_total_students.php

// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to count total students
    $stmt = $pdo->query('SELECT COUNT(*) as total_students FROM students');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the count as JSON
    echo json_encode(['success' => true, 'total_students' => $result['total_students']]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
