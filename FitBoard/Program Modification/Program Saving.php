<?php

header('Content-Type: application/json');
$response = [];

// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Database connection
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the posted data
    $data = json_decode(file_get_contents('php://input'), true);

    // Insert into exercise_programs table
    $stmt = $db->prepare('INSERT INTO exercise_programs (name, number_of_sessions, tier) VALUES (:name, :sessions, :tier)');
    $stmt->execute([
        ':name' => $data['programName'],
        ':sessions' => $data['programSessions'],
        ':tier' => $data['programTier']
    ]);

    $programId = $db->lastInsertId();

    // Insert into program_tables and program_exercises tables
    foreach ($data['tablesData'] as $tableNumber => $tableData) {
        $stmt = $db->prepare('INSERT INTO program_tables (program_id, table_number) VALUES (:program_id, :table_number)');
        $stmt->execute([
            ':program_id' => $programId,
            ':table_number' => $tableNumber
        ]);

        $tableId = $db->lastInsertId();

        $exerciseStmt = $db->prepare('INSERT INTO program_exercises (table_id, name, sets, reps, type) VALUES (:table_id, :name, :sets, :reps, :type)');
        foreach (['yoga', 'pre_hab', 'main_workout', 'mobility'] as $category) {
            foreach ($tableData[$category] as $exercise) {
                $exerciseStmt->execute([
                    ':table_id' => $tableId,
                    ':name' => $exercise['name'],
                    ':sets' => $exercise['sets'],
                    ':reps' => $exercise['reps'],
                    ':type' => $category
                ]);
            }
        }
    }

    $response['success'] = true;
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response);

?>
