<?php
// Database credentials
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_exercise_programs;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Connect to the database
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $programId = $input['programId'];

    if (!$programId) {
        echo json_encode(['success' => false, 'error' => 'Program ID is required.']);
        exit;
    }

    // Begin a transaction
    $pdo->beginTransaction();

    // Delete exercises associated with the program tables
    $deleteExercises = $pdo->prepare("
        DELETE program_exercises 
        FROM program_exercises 
        JOIN program_tables ON program_exercises.table_id = program_tables.table_id 
        WHERE program_tables.program_id = :programId
    ");
    $deleteExercises->execute([':programId' => $programId]);

    // Delete the tables associated with the program
    $deleteTables = $pdo->prepare("
        DELETE FROM program_tables 
        WHERE program_id = :programId
    ");
    $deleteTables->execute([':programId' => $programId]);

    // Delete the program itself
    $deleteProgram = $pdo->prepare("
        DELETE FROM exercise_programs 
        WHERE program_id = :programId
    ");
    $deleteProgram->execute([':programId' => $programId]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    // Roll back the transaction if something failed
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
