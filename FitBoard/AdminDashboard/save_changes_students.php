<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
        foreach ($data as $student) {
            $stmt = $pdo->prepare('UPDATE students SET sbhs_id = ?, first_name = ?, last_name = ?, year = ?, tier = ? WHERE id = ?');
            $stmt->execute([
                $student['sbhs_id'],
                $student['firstName'],
                $student['lastName'],
                $student['studentYear'],
                $student['tier'],
                $student['id']
            ]);
        }

        $response = ['status' => 'success', 'message' => 'Changes saved successfully.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Invalid data format.'];
    }
} catch (PDOException $e) {
    $response = ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
