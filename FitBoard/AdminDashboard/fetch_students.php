<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
     // Create a new PDO instance
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the SQL query
    $stmt = $pdo->query('SELECT id, SBHS_ID AS sbhs_id, first_name AS firstName, last_name AS lastName, year AS studentYear, tier FROM students');
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

     // Return the results as a JSON array
    echo json_encode($students);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
