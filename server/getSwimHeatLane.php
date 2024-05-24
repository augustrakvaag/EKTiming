<?php
    include "credentials.php";
    $success = false;
    $startTime = 0;
    $ended = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){        
        $data = json_decode(file_get_contents('php://input'), true);
        $lane = $data["lane"];
        $heat = $data["heat"];

        $query = $db->prepare('SELECT *, COUNT(*) as count FROM HeatLane WHERE event_id = :event AND heat = :heat AND lane = :lane');
        $query->bindValue(':event', $event, SQLITE3_TEXT);
        $query->bindValue(':heat', $heat, SQLITE3_TEXT);
        $query->bindValue(':lane', $lane, SQLITE3_INTEGER);
        $result = $query->execute();
        if($result){
            $row = $result->fetchArray(SQLITE3_ASSOC);
            $success = $row['count'] == 1;
            $startTime = $row['swimStartTime'];
            $ended = $row['ended'] == 1 ? true : false;
        }
    }

    $success = json_encode($success);
    $startTime = json_encode($startTime);
    $ended = json_encode($ended);
    $admin = json_encode($admin || $superAdmin);

    header('Content-Type: application/json');
    echo '{"success":'.$success.', "startTime": '.$startTime.', "ended": '.$ended.', "admin": '.$admin.'}'; 
?>