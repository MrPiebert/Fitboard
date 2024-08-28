<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_videos;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = $_POST['id'];

    $stmt = $db->prepare('DELETE FROM videos WHERE id = ?');
    $stmt->execute([$id]);

    echo 'Video deleted successfully';
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
}
?>
