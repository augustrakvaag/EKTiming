<?php
    include "credentials.php";
    $success = false;

    if(($admin || $superAdmin) && $_SERVER['CONTENT_LENGTH'] > 0){
        $data = json_decode(file_get_contents('php://input'), true);
        $cid = intval($data['cid']);

        $deleteQuery = $db->prepare('DELETE FROM Contestant WHERE contestant_id = :cid');
        $deleteQuery->bindValue(':cid', $cid, SQLITE3_INTEGER);
        if($deleteQuery->execute()){
            $success = true;
        } 
    }

    $success = json_encode($success);
    $admin = json_encode($admin);
    header('Content-Type: application/json');
    echo '{"success":'.$success.', "admin": '.$admin.'}'; 
?>