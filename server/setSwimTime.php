<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){        
        $data = json_decode(file_get_contents('php://input'), true);
        $startNr = $data['startNr'];
        $time = $data['time'];

        $updateQuery = $db->prepare('UPDATE Contestant SET swimEndTime = :time WHERE startNr = :startNr AND event_id = \''.$event.'\'');
        $updateQuery->bindValue(':startNr',$startNr, SQLITE3_INTEGER);
        $updateQuery->bindValue(':time',$time, SQLITE3_INTEGER);
        if($updateQuery->execute()){
            $success = true;
        }
   
    }

    $success = json_encode($success);
    $admin = json_encode($admin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>