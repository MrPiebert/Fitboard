<?php
// Database connection details
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_videos;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    // Establish a database connection
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if required POST parameters are set
    if (isset($_POST['video_id'], $_POST['title'], $_POST['description'], $_POST['link'])) {
        // Retrieve form data from the POST request
        $videoId = $_POST['video_id'];
        $title = $_POST['title'];
        $description = $_POST['description'];
        $link = $_POST['link'];

        // Ensure that the link is valid (YouTube URL validation as per your requirements)
        if (preg_match('/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/', $link)) {
            // Prepare the SQL update statement
            $sql = "UPDATE videos SET title = :title, description = :description, link = :link WHERE id = :video_id";
            $stmt = $pdo->prepare($sql);

            // Bind the parameters
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':link', $link);
            $stmt->bindParam(':video_id', $videoId, PDO::PARAM_INT);

            // Execute the update query
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Video updated successfully.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update video.']);
            }
        } else {
            // Invalid link error
            echo json_encode(['status' => 'error', 'message' => 'Invalid YouTube link.']);
        }
    } else {
        // Missing parameters error
        echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
    }
} catch (PDOException $e) {
    // Handle database connection or query errors
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
