<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){        
        $data = json_decode(file_get_contents('php://input'), true);
        $lanes = $data["lanes"];
        $heats = $data["heats"];
        $time = $data["time"];

            
        $success = count($heats) > 0;
        foreach($heats as $heat){
            foreach($lanes as $lane){
                $query = $db->prepare('SELECT swimStartTime FROM HeatLane WHERE heat = :heat AND lane = :lane AND event_id = \''.$event.'\'');
                $query->bindValue(':heat',$heat, SQLITE3_TEXT);
                $query->bindValue(':lane',$lane, SQLITE3_INTEGER);
                $result = $query->execute();
                $row = $result->fetchArray(SQLITE3_ASSOC);

                if($row['swimStartTime'] == 0){
                    $updateQuery = $db->prepare('UPDATE HeatLane SET swimStartTime = :time, ended = 0 WHERE heat = :heat AND lane = :lane AND event_id = \''.$event.'\'');
                    $updateQuery->bindValue(':heat',$heat, SQLITE3_TEXT);
                    $updateQuery->bindValue(':lane',$lane, SQLITE3_INTEGER);
                    $updateQuery->bindValue(':time',$time, SQLITE3_INTEGER);
                    if(!$updateQuery->execute()){
                        $success = false;
                    }
                }
            }
        }   
    }

    $success = json_encode($success);
    $admin = json_encode($admin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>