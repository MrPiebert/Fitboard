<?php
// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_admin;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Create a new PDO instance for database connection
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Start the session to store login state
    session_start();

    // Check if the form has been submitted
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the submitted email and password from the form
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Prepare SQL query to fetch user details by email
        $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        // Fetch the user record
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if user exists and the password is correct
        if ($user && password_verify($password, $user['password_hash'])) {
            // Login successful - Store session variables
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_email'] = $user['email'];

            // Redirect to the admin dashboard
            header("Location: ../Dashboard/adminDashboard.html");
            exit();
        } else {
            // Login failed - Display error message
            echo '<div class="error-message">Unable to log you in. Unknown email or bad password.</div>';
        }
    }
} catch (PDOException $e) {
    // Handle connection error
    echo '<div class="error-message">Database error: ' . $e->getMessage() . '</div>';
}
?>
