<?php
    include "credentials.php";
    $success = false;
    $heats = array();
    $lanes = array();

    if(isset($event) && $event != null){
        $query = $db->prepare("SELECT * FROM HeatLane WHERE event_id = '$event'");
        $result = $query->execute();
        if ($result) {
            $success = true;
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $heat = $row['heat'];
                $lane = $row['lane'];
                if(!in_array($heat, $heats)){
                    $heats[] = $heat;
                }
                if(!in_array($lane, $lanes)){
                    $lanes[] = $lane;
                }
            }
        }
    }

    $success = json_encode($success);
    $heats = json_encode($heats);
    $lanes = json_encode($lanes);
    $admin = json_encode($admin || $superAdmin);
    $event = json_encode($event);

    header('Content-Type: application/json');
    echo '{"success":'.$success.', "heats": '.$heats.', "lanes": '.$lanes.', "admin": '.$admin.', "event": '.$event.'}'; 
?>