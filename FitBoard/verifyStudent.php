<?php
header('Content-Type: application/json');

// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the JSON body
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if studentId was provided
    if (!isset($input['studentId'])) {
        echo json_encode(['success' => false, 'message' => 'No studentId provided']);
        exit;
    }

    $studentId = $input['studentId'];

    // Prepare and execute the query to check if the student exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE SBHS_ID = :studentId");
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        // Student exists
        echo json_encode(['success' => true]);
    } else {
        // Student does not exist
        echo json_encode(['success' => false]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
