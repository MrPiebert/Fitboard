<?php
header('Content-Type: application/json');

// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the student ID from the request
    $studentId = $_GET['studentId'] ?? '';

    if ($studentId) {
        // Retrieve the biography from the database
        $query = 'SELECT biography FROM students WHERE SBHS_ID = :studentId';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':studentId', $studentId);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            echo json_encode(['success' => true, 'biography' => $result['biography']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Biography not found.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Student ID is required.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
