<?php
header('Content-Type: application/json');

// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the JSON data from the request
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['studentId']) && isset($data['biography'])) {
        $studentId = $data['studentId'];
        $biography = $data['biography'];

        // Update the biography in the database
        $query = 'UPDATE students SET biography = :biography WHERE SBHS_ID = :studentId';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':biography', $biography);
        $stmt->bindParam(':studentId', $studentId);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update biography.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid input.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
