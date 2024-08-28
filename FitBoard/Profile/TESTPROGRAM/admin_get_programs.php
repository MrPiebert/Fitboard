<?php
header('Content-Type: application/json');

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

// Tier ranking system (not used here, but retained for potential future use)
$tier_ranking = [
    'I_1' => 1,
    'I_2' => 2,
    'I_3' => 3,
    'P_1' => 4,
    'P_2' => 5,
    'P_3' => 6,
    'ADV' => 7
];

try {
    // Connect to the database
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch all programs
    $stmt = $db->query('SELECT program_id, name, number_of_sessions AS sessions, tier FROM exercise_programs');

    $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the programs as JSON
    echo json_encode($programs);
} catch (PDOException $e) {
    // Log the error message
    error_log('Database Error: ' . $e->getMessage());

    // Return an error response
    echo json_encode(['error' => $e->getMessage()]);
}
?>
