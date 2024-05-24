<?php
    include "credentials.php";
    $success = false;
    $contestants = array();

    if(isset($event) && $event != null){
        $query = $db->prepare("
            SELECT c.*, h.heat, h.lane, h.swimStartTime, h.ended
            FROM Contestant c
            JOIN HeatLane h ON c.heatLane_id = h.heatLane_id
            WHERE c.event_id = '$event'
        ");

        $result = $query->execute();
        if ($result) {
            $success = true;
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $swimStart = $row['swimStartTime'];
                $swimEnd = $row['swimEndTime'];
                $swimTime = 0;
                if($swimStart != 0 && $swimEnd != 0) {$swimTime = $swimEnd - $swimStart; }
                $runStart = $row['runStartTime'];
                $runEnd = $row['runEndTime'];
                $runTime = 0;
                if($runStart != 0 && $runEnd != 0) {$runTime = $runEnd - $runStart; }
                $contestant = array(
                    'name' => $row['fullName'],
                    'startNr' => $row['startNr'],
                    'heat' => $row['heat'],
                    'lane' => $row['lane'],                    
                    'swimStart' => $swimStart,
                    'swimEnd' => $swimEnd,
                    'swimTime' => $swimTime,
                    'runStart' => $runStart,
                    'runEnd' => $runEnd,
                    'runTime' => $runTime
                );
                $contestants[] = $contestant;
            }
        }
    }

    $success = json_encode($success);
    $contestants = json_encode($contestants);
    $admin = json_encode($admin);
    $event = json_encode($event);

    header('Content-Type: application/json');
    echo '{"success":'.$success.', "contestants": '.$contestants.', "admin": '.$admin.', "event": '.$event.'}'; 
?>