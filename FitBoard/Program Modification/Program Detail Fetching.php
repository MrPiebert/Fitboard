<?php

header('Content-Type: application/json');

// Get the program ID from the query string
$programId = isset($_GET['program_id']) ? (int)$_GET['program_id'] : 0;

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL query
    $stmt = $db->prepare('
        SELECT e.name AS exercise_name, e.sets, e.reps, e.type, t.table_number, p.name AS program_name
        FROM program_exercises e
        JOIN program_tables t ON e.table_id = t.table_id
        JOIN exercise_programs p ON t.program_id = p.program_id
        WHERE p.program_id = :program_id
    ');
    $stmt->bindParam(':program_id', $programId, PDO::PARAM_INT);

    // Execute the query
    $stmt->execute();

    // Fetch the results
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode(['success' => true, 'program' => $exercises]);

} catch (PDOException $e) {
    // Return an error response
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
