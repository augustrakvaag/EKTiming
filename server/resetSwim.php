<?php
    include "credentials.php";
    $success = false;

    if($admin || $superAdmin){    
        $success = true;    
        $updateQuery = $db->prepare('UPDATE HeatLane SET ended = 0, swimStartTime = 0 WHERE event_id = \''.$event.'\'');
        if(!$updateQuery->execute()){
            $success = false;
        } 
        $updateQuery = $db->prepare('UPDATE Contestant SET  swimEndTime = 0 WHERE event_id = \''.$event.'\'');
        if(!$updateQuery->execute()){
            $success = false;
        } 
    }

    $success = json_encode($success);
    $admin = json_encode($admin || $superAdmin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>