<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$program_id = intval($_GET['program_id']); // Always sanitize input

// Prepare the SQL query
$sql = "SELECT ep.name as program_name, ep.number_of_sessions, ep.tier,
               pt.table_id, pt.table_number, 
               pe.exercise_id, pe.name as exercise_name, pe.sets, pe.reps, pe.type
        FROM exercise_programs ep
        LEFT JOIN program_tables pt ON ep.program_id = pt.program_id
        LEFT JOIN program_exercises pe ON pt.table_id = pe.table_id
        WHERE ep.program_id = ?";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $program_id);
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Initialize an array to hold the program data
$programData = [
    'name' => '',
    'number_of_sessions' => 0,
    'tier' => '',
    'tables' => []
];

while ($row = $result->fetch_assoc()) {
    $programName = $row['program_name'];
    $numberOfSessions = $row['number_of_sessions'];
    $tier = $row['tier'];

    $tableId = $row['table_id'];
    $tableNumber = $row['table_number'];

    $exerciseId = $row['exercise_id'];
    $exerciseName = $row['exercise_name'];
    $sets = $row['sets'];
    $reps = $row['reps'];
    $type = $row['type'];

    // Populate the program data
    if (empty($programData['name'])) {
        $programData['name'] = $programName;
        $programData['number_of_sessions'] = $numberOfSessions;
        $programData['tier'] = $tier;
    }

    if ($tableId) {
        if (!isset($programData['tables'][$tableId])) {
            $programData['tables'][$tableId] = [
                'table_id' => $tableId,
                'table_number' => $tableNumber,
                'exercises' => []
            ];
        }

        if ($exerciseId) {
            $programData['tables'][$tableId]['exercises'][] = [
                'exercise_id' => $exerciseId,
                'name' => $exerciseName,
                'sets' => $sets,
                'reps' => $reps,
                'type' => $type
            ];
        }
    }
}

// Convert the associative array to a JSON-encoded string
$jsonData = json_encode($programData);

// Close the statement and connection
$stmt->close();
$conn->close();

// Output the JSON data
header('Content-Type: application/json');
echo $jsonData;
?>