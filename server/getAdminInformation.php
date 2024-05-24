<?php
    include "credentials.php";
    $success = false;
    $pw = "";
    $heatLanes = array();
    $contestants = array();


    if($admin || $superAdmin){
        $success = true;
        $pw = $eventPassword;

        $query = $db->prepare('SELECT heatLane_id, heat, lane FROM HeatLane WHERE event_id = \''.$event.'\'');
        $result = $query->execute();
        if($result){
            while($row = $result->fetchArray(SQLITE3_ASSOC)){
                $heatLane = array(
                    'hid' => $row['heatLane_id'],
                    'heat' => $row['heat'],
                    'lane' => $row['lane']
                );
                $heatLanes[] = $heatLane;
            }  
        }

        $query = $db->prepare('SELECT * FROM Contestant WHERE event_id =  \''.$event.'\' ORDER BY startNr ASC');
        $result = $query->execute();
        if($result){
            while($row = $result->fetchArray(SQLITE3_ASSOC)){
                $contestant = array(
                    'cid' => $row['contestant_id'],
                    'hid' => $row['heatLane_id'],
                    'name' => $row['fullName'],
                    'startNr' => $row['startNr'],
                    'swimEndTime' => $row['swimEndTime'],
                    'runStartTime' => $row['runStartTime'],
                    'runEndTime' => $row['runEndTime']
                );
                $contestants[] = $contestant;
            }  
        }
    }

    $success = json_encode($success);
    $event = json_encode($event);
    $heatLanes = json_encode($heatLanes);
    $contestants = json_encode($contestants);
    $admin = json_encode($admin || $superAdmin);
    $pw = json_encode($pw);

    header('Content-Type: application/json');
    echo '{"success":'.$success.', "event": '.$event.', "heatLanes": '.$heatLanes.', "contestants": '.$contestants.', "admin": '.$admin.', "pw": '.$pw.'}'; 
?>