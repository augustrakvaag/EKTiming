<?php 
    include "../server/credentials.php"; 
?>

<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check In</title>
</head>
<body>
    <style>
        body{
            background-color: <?php 
                if($admin || $superAdmin){
                    echo "green";
                }
                else if($event != null){
                    echo "orange";
                }
                else{
                    echo "#1f1f1f";
                }
            ?> ;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0px;
            font-family: Arial;
            min-height: 100vh;
        }
        div{
            margin: 15px auto;
        }
        #synchWindow{
            display: flex;
            flex-direction: column;
            width: 50%;
            max-width: 500px;
            border: 1px solid black;
            /* aspect-ratio: 1/1; */
            background-color: rgba(255,255,255, 0.5);
        }
        input{
            margin-bottom: 5px;
        }
        a, #adminLink{
            display: flex;
            flex-direction: column;
            text-align: center;
            margin: 15px auto;
            text-decoration: none;
            border: 1px solid white;
            background-color: black;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            user-select: none;
        }
    </style>

    <?php 
        if($admin) {echo '<div style="display: flex; width: 100%; flex-direction: row; justify-content: space-around;"><a href="judgeSwim/"> JUDGE SWIM </a> <a href="judgeRun/"> JUDGE RUN </a> </div>';}        
        if($admin || $superAdmin) { echo '<div id="adminLink"  onclick="youSureAboutThat()"> ADMIN PAGE </div>';}
        if($superAdmin) { echo '<a href="superUser/">GOD PAGE</a>'; }
    ?>

    <div>
        <h3 id="eventName"></h3>
    </div>
    <div>
        <input type="text" id="event" placeholder="event" autocomplete="off"><br>
        <input type="text" id="pw" placeholder="password" autocomplete="off"><br>
        <button id="checkin">Check In</button><button id="synchStopWatch" style="margin-left: 15px;">Synchronize</button>
    </div>
    <div id="synchWindow">
        <img src="stopwatch_icon.png" width="100%" height="100%">
    </div>
    <div id="clearSessionData">
        <button id="clearCache">Clear Session Data</button>
    </div>
    <script src="checkin.js"></script>
</body>
</html>