<?php
    include "credentials.php";
    $success = false;

    if($admin || $superAdmin){   
        $updateQuery = $db->prepare('UPDATE Contestant SET runEndTime = 0, runStartTime = 0 WHERE event_id = \''.$event.'\'');
        if($updateQuery->execute()){
            $success = true;
        } 
    }

    $success = json_encode($success);
    $admin = json_encode($admin || $superAdmin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>