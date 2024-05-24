<?php
    $db = $db = new SQLite3($_SERVER['DOCUMENT_ROOT'].'/jonekra/ntnui/EKTiming/server/db.db'); // <-- CHANGE THIS, INCLUDING THE NAME OF THE DATABASE (for security [by obscurity], make it random)

    $superAdminPasswords = ["_helicopter_"]; // <-- CHANGE THIS

    $superAdmin = false;    
    $admin = false;  
    $event = null; 
    $eventPassword = null;

    if(isset($_COOKIE['event'])){
        $query = $db->prepare('SELECT *, COUNT(*) as count FROM Event WHERE event_id = :event');
        $query->bindValue(':event', $_COOKIE['event'], SQLITE3_TEXT);
        $result = $query->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        if($row['count'] == 1){
            $event = $row['event_id'];
            $eventPassword = $row['pw'];
        }
    }
    if(isset($_COOKIE['pw'])){
        if($eventPassword != null){
            $admin = $_COOKIE['pw'] == $eventPassword;    
        }
        $superAdmin = in_array($_COOKIE['pw'], $superAdminPasswords);
    }
?>
