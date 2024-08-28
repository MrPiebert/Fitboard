<?php
header('Content-Type: application/json');

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get studentId from query
    $studentId = $_GET['studentId'] ?? '';

    if ($studentId) {
        // Query the student's tier
        $stmt = $db->prepare('SELECT tier FROM students WHERE SBHS_ID = :studentId');
        $stmt->execute([':studentId' => $studentId]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($student) {
            echo json_encode(['success' => true, 'tier' => $student['tier']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Student not found']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No student ID provided']);
    }
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
