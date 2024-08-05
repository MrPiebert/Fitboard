<?php
header('Content-Type: application/json');

// Get the program ID from the query parameter
$programId = $_GET['id'];

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch exercises for the selected program
    $stmt = $db->prepare('SELECT day, category, name, sets, reps FROM exercises WHERE program_id = :program_id ORDER BY day');
    $stmt->bindParam(':program_id', $programId);
    $stmt->execute();
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Organize exercises by day
    $programDetails = [];
    foreach ($exercises as $exercise) {
        $day = $exercise['day'];
        if (!isset($programDetails[$day])) {
            $programDetails[$day] = ['day' => $day, 'exercises' => []];
        }
        $programDetails[$day]['exercises'][] = $exercise;
    }

    // Return program details as JSON
    echo json_encode(['exercises' => array_values($programDetails)]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>