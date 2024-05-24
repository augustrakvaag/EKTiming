<?php
    include "credentials.php";
    $admin = json_encode($admin);
    $superAdmin = json_encode($superAdmin);
    $event = json_encode($event);
    header('Content-Type: application/json');
    echo '{"event": '.$event.', "admin": '.$admin.', "superAdmin": '.$superAdmin.'}'; 
?>