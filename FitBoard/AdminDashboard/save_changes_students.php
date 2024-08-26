<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_students;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Decode JSON data
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
        $isValid = true;
        $invalidRows = [];

        foreach ($data as $index => $student) {
            // Log data for debugging
            error_log("Validating student: " . print_r($student, true));

            // Validate SBHS ID
            if (!preg_match('/^\d{9}$/', $student['sbhs_id'])) {
                $invalidRows[] = $index; // Track invalid rows
                $isValid = false;
                continue; // Skip to next student
            }

            // Validate first and last names
            if (!preg_match('/^[A-Z][A-Za-z\s-]*$/', $student['firstName']) || !preg_match('/^[A-Z][A-Za-z\s-]*$/', $student['lastName'])) {
                $invalidRows[] = $index; // Track invalid rows
                $isValid = false;
                continue; // Skip to next student
            }

            // Validate year
            if (!preg_match('/^(7|8|9|10|11|12)$/', $student['studentYear'])) {
                $invalidRows[] = $index; // Track invalid rows
                $isValid = false;
                continue; // Skip to next student
            }

            // If all validations pass, update the student
            if ($isValid) {
                $stmt = $pdo->prepare('UPDATE students SET sbhs_id = ?, first_name = ?, last_name = ?, year = ?, tier = ? WHERE id = ?');
                if ($stmt->execute([
                    $student['sbhs_id'],
                    $student['firstName'],
                    $student['lastName'],
                    $student['studentYear'],
                    $student['tier'],
                    $student['id']
                ]) === false) {
                    $response = ['status' => 'error', 'message' => 'Database update failed.'];
                    $isValid = false;
                    break;
                }
            }
        }

        if ($isValid) {
            $response = ['status' => 'success', 'message' => 'Changes saved successfully.'];
        } else {
            $response = ['status' => 'error', 'message' => 'Validation errors occurred.', 'invalidRows' => $invalidRows];
        }
    } else {
        $response = ['status' => 'error', 'message' => 'Invalid data format.'];
    }
} catch (PDOException $e) {
    $response = ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
}

// Log the response for debugging
error_log("Response: " . json_encode($response));

header('Content-Type: application/json');
echo json_encode($response);
?>
