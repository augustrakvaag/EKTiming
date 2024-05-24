<?php
    include "credentials.php";
    $success = false;

    // CONSIDER: Whether or not this is a safe option to give the admin people   
    if(($admin || $superAdmin)  && $_SERVER['CONTENT_LENGTH'] > 0){        
        $data = json_decode(file_get_contents('php://input'), true); // TODO
        $updateQuery = $db->prepare('UPDATE HeatLane SET ended = 0, swimStartTime = 0 WHERE event_id = \''.$event.'\' AND heat = :heat');
        if(!$updateQuery->execute()){
            $success = false;
        } 
        $updateQuery = $db->prepare('UPDATE Contestant SET swimEndTime = 0 WHERE event_id = \''.$event.'\'');
        if(!$updateQuery->execute()){
            $success = false;
        } 
    }

    $success = json_encode($success);
    $admin = json_encode($admin || $superAdmin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>