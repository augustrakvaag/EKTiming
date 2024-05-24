<?php
    $error = 0;

    if($_SERVER['CONTENT_LENGTH'] > 0){
        $data = json_decode(file_get_contents('php://input'), true);
        $now = intval(microtime(true)*1000); // Convert to milliseconds
        $clientTime = intval($data['time']);
        $error = $now - $clientTime;  
    }

    $error = json_encode($error);
    header('Content-Type: application/json');
    echo '{"dt":'.$error.'}';
?>