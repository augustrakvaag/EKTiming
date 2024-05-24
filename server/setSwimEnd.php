<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){        
        $data = json_decode(file_get_contents('php://input'), true);
        $lanes = $data["lanes"];
        $heats = $data["heats"];
        $success = true;
        foreach($heats as $heat){
            foreach($lanes as $lane){
                $updateQuery = $db->prepare('UPDATE HeatLane SET ended = 1 WHERE event_id = :event AND heat = :heat AND lane = :lane');
                $updateQuery->bindValue(':event',$event, SQLITE3_TEXT);
                $updateQuery->bindValue(':heat',$heat, SQLITE3_TEXT);
                $updateQuery->bindValue(':lane',$lane, SQLITE3_INTEGER);
                if(!$updateQuery->execute()){
                    $success = false;
                }
            }
        }
    }

    $success = json_encode($success);
    $admin = json_encode($admin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>