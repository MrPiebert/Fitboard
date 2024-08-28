<?php
// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_admin;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Create a new PDO instance
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch the biography for the hardcoded admin ID
    $query = "SELECT biography FROM admin_users WHERE id = 1";
    $statement = $db->prepare($query);
    $statement->execute();

    $result = $statement->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(['success' => true, 'biography' => $result['biography']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Biography not found.']);
    }
} catch (PDOException $e) {
    // Output any error messages
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
