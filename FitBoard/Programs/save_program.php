<?php
header('Content-Type: application/json');

// Get the raw POST data
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL statement
    $stmt = $db->prepare('INSERT INTO programs (name, sessions, tier) VALUES (:name, :sessions, :tier)');
    $stmt->bindParam(':name', $data['programName']);
    $stmt->bindParam(':sessions', $data['programSessions']);
    $stmt->bindParam(':tier', $data['programTier']);

    // Execute the SQL statement
    $stmt->execute();

    // Get the last inserted program ID
    $programId = $db->lastInsertId();

    // Prepare the SQL statement for exercises
    $stmtExercise = $db->prepare('INSERT INTO exercises (program_id, day, category, name, sets, reps) VALUES (:program_id, :day, :category, :name, :sets, :reps)');

    // Loop through exercises and insert them
    foreach ($data['exercises'] as $exercise) {
        $stmtExercise->bindParam(':program_id', $programId);
        $stmtExercise->bindParam(':day', $exercise['day']);
        $stmtExercise->bindParam(':category', $exercise['category']);
        $stmtExercise->bindParam(':name', $exercise['name']);
        $stmtExercise->bindParam(':sets', $exercise['sets']);
        $stmtExercise->bindParam(':reps', $exercise['reps']);
        $stmtExercise->execute();
    }

    // Return a success response
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    // Return an error response
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
