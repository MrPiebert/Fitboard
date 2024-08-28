<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_videos;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query('SELECT id, title, description, youtube_link FROM videos');
    $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($videos);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
