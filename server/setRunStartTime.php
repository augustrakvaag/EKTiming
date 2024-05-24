<?php
    include "credentials.php";
    $success = false;

    function compareSwimTime($a, $b) {
        return $a['swimTime'] - $b['swimTime'];
    }

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){    
        $success = true;

        $data = json_decode(file_get_contents('php://input'), true);
        $now = intval(microtime(true)*1000);
        $startTime = $now+intval($data['startTime']);
        $huntPeriod = intval($data['huntPeriod']);
        $intervalTime = intval($data['intervalTime']);

        $query = $db->prepare("
            SELECT c.*, h.swimStartTime
            FROM Contestant c
            JOIN HeatLane h ON c.heatLane_id = h.heatLane_id
            WHERE c.event_id = '$event'
        ");
        $result = $query->execute();

        $contestants = array();
        if ($result) {
            $success = true;
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $swimStart = $row['swimStartTime'];
                $swimEnd = $row['swimEndTime'];
                $swimTime = 0;
                if($swimStart != 0 && $swimEnd != 0) {$swimTime = $swimEnd - $swimStart; }
                $contestant = array(
                    'cid' => $row['contestant_id'],                   
                    'swimTime' => $swimTime,
                    'startTime' => $row['runStartTime']
                );
                $contestants[] = $contestant;
            }
        }
        usort($contestants, 'compareSwimTime');

        $initiated = false;
        $bestSwimTime = 0;
        $intervalStartOffset = $huntPeriod;
        foreach($contestants as $contestant){
            $cid = $contestant['cid'];
            $swimTime = $contestant['swimTime'];
            $time = $startTime;
            $dt = $swimTime - $bestSwimTime;

            if($contestant['startTime'] != 0) { 
                $success = false;
                break; 
            }
            if($swimTime == 0) { continue; }

            if(!$initiated){
                $bestSwimTime = $swimTime;
                $initiated = true;
                if($time+$intervalTime >= $huntPeriod){
                    $intervalStartOffset = $time+$intervalTime;
                }
            }
            else if($dt < $huntPeriod){
                $time += $dt;
                if($time+$intervalTime >= $huntPeriod){
                    $intervalStartOffset = $time+$intervalTime;
                }
            }
            else{
                $time = $intervalStartOffset;
                $intervalStartOffset += $intervalTime;
            }

            $updateQuery = $db->prepare('UPDATE Contestant SET runStartTime = :time WHERE contestant_id = :cid AND event_id = \''.$event.'\'');
            $updateQuery->bindValue(':cid',$cid, SQLITE3_INTEGER);
            $updateQuery->bindValue(':time',$time, SQLITE3_INTEGER);
            if(!$updateQuery->execute()){
                $success = false;
            }
        }   
    }

    $success = json_encode($success);
    $admin = json_encode($admin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.', "startTime": '.$startTime.', "intervalTime": '.$intervalTime.'}'; 
?>