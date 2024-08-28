<?php
$dsn = 'mysql:host=sql112.infinityfree.com;dbname=if0_36607942_videos;charset=utf8';
$username = 'if0_36607942';
$password = 'Lf1knlji5fBcBd';

try {
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query('SELECT * FROM videos');
    $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($videos);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
