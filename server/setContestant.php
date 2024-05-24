<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){
        $data = json_decode(file_get_contents('php://input'), true);
        $cid = intval($data['cid']);
        $startNr = intval($data['startNr']);
        $name = $data['name'];
        $hid = intval($data['hid']);
        $runStartTime = intval($data['runStartTime']);

        $updateQuery = $db->prepare('UPDATE Contestant SET startNr = :startNr, fullName = :name, heatLane_id = :hid, runStartTime = :runStartTime WHERE contestant_id = :cid');
        $updateQuery->bindValue(':startNr', $startNr, SQLITE3_INTEGER);
        $updateQuery->bindValue(':name', $name, SQLITE3_TEXT);     
        $updateQuery->bindValue(':hid', $hid, SQLITE3_INTEGER);
        $updateQuery->bindValue(':runStartTime', $runStartTime, SQLITE3_INTEGER);
        $updateQuery->bindValue(':cid', $cid, SQLITE3_INTEGER);
        if($updateQuery->execute()){
            $success = true;
        } 
    }

    $success = json_encode($success);
    $admin = json_encode($admin || $superAdmin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>