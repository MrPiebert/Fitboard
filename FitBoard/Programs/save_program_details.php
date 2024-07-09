<?php
header('Content-Type: application/json');

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);
$programId = $data['programId'];
$exercises = $data['exercises'];

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Delete existing exercises for the program
    $stmt = $db->prepare('DELETE FROM exercises WHERE program_id = :program_id');
    $stmt->bindParam(':program_id', $programId);
    $stmt->execute();

    // Insert updated exercises
    $stmt = $db->prepare('INSERT INTO exercises (program_id, day, category, name, sets, reps) VALUES (:program_id, :day, :category, :name, :sets, :reps)');
    foreach ($exercises as $exercise) {
        $stmt->bindParam(':program_id', $programId);
        $stmt->bindParam(':day', $exercise['day']);
        $stmt->bindParam(':category', $exercise['category']);
        $stmt->bindParam(':name', $exercise['name']);
        $stmt->bindParam(':sets', $exercise['sets']);
        $stmt->bindParam(':reps', $exercise['reps']);
        $stmt->execute();
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
