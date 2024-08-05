<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $studentYear = $_POST['studentYear'];
    $tier = 'Induction_1';  // Default tier value
    $assessmentPending = 0; // Default assessment_pending value (false)

    $stmt = $pdo->prepare('INSERT INTO students (first_name, last_name, year, tier, assessment_pending) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$firstName, $lastName, $studentYear, $tier, $assessmentPending]);

    echo "Student data saved successfully.";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
