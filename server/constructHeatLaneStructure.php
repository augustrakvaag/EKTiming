<?php
    include "credentials.php";
    $success = false;

    if($superAdmin && $_SERVER['CONTENT_LENGTH'] > 0){
        $data = json_decode(file_get_contents('php://input'), true);
        $eid = isset($data['eid']) ? $data['eid'] : "";
        $heats = isset($data['heats']) ? $data['heats'] : [];
        $lanes = isset($data['lanes']) ? $data['lanes'] : [];

        $success = true;
        foreach($heats as $heat){
            foreach($lanes as $lane){
                $query = $db->prepare('INSERT INTO HeatLane(event_id, heat, lane, swimStartTime, ended) VALUES (:eid, :heat, :lane, 0, 0)');
                $query->bindValue(':eid', $eid, SQLITE3_TEXT);
                $query->bindValue(':heat', $heat, SQLITE3_TEXT);
                $query->bindValue(':lane', $lane, SQLITE3_INTEGER);
                if(!$query->execute()){
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