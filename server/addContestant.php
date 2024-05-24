<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];

        $event_id = $event;
        $fullName = $name;
        $startNr = 999;
        $heatLane_id = 1;
        $swimEndTime = 0;
        $runStartTime = 0;
        $runEndTime = 0;

        $query = $db->prepare('INSERT INTO Contestant (event_id, fullName, startNr, heatLane_id, swimEndTime, runStartTime, runEndTime) VALUES (:event_id, :fullName, :startNr, :heatLane_id, :swimEndTime, :runStartTime, :runEndTime)');
        $query->bindParam(':event_id', $event_id, SQLITE3_TEXT);
        $query->bindParam(':fullName', $fullName, SQLITE3_TEXT);
        $query->bindParam(':startNr', $startNr, SQLITE3_INTEGER);
        $query->bindParam(':heatLane_id', $heatLane_id, SQLITE3_INTEGER);
        $query->bindParam(':swimEndTime', $swimEndTime, SQLITE3_INTEGER);
        $query->bindParam(':runStartTime', $runStartTime, SQLITE3_INTEGER);
        $query->bindParam(':runEndTime', $runEndTime, SQLITE3_INTEGER);
        if($query->execute()){
            $success = true;
        }
    }

    $success = json_encode($success);
    $admin = json_encode($admin || $superAdmin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>