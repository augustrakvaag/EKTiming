function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

let serverDelayArray = [];
function synch(repeat = 0, reset = true){
    if(reset){
        serverDelayArray = [];
    }        
    const data = {
        time: new Date().getTime()
    };
    fetch('../server/synch.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(log => {
        serverDelayArray.push(log.dt);
        if (repeat > 0) {
            repeat--;
            synch(repeat, false);
        }
        else{
            let sum = 0;
            for(var i = 0; i < serverDelayArray.length; i++){
                sum += serverDelayArray[i];
            }
            let serverDelay = serverDelayArray.length ? Math.round(sum/serverDelayArray.length) : 0;
            localStorage.setItem("serverDelay", serverDelay);
            window.location.href = "";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });        
}

document.getElementById("checkin").addEventListener("click", function(){
    let pw = document.getElementById("pw").value;
    let event = document.getElementById("event").value;
    
    setCookie("pw", pw, 100);
    setCookie("event", event, 100);

    localStorage.clear();
    //alert("Synching stopwatch with server, this may take a few seconds. The page will automaticly refresh after the watches has synchronized");
    synch(5, true);
});

document.getElementById("synchStopWatch").addEventListener("click", function(){ synch(5, true); });

let admin = false;
let superAdmin = false;
let eventName = null;

/*INIT*/ {
    let data = {};
    fetch('../server/getCredentials.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(log => {
        console.log(log);
        admin = log.admin;
        superAdmin = log.superAdmin;
        eventName = log.event;
        if(log.event != null){
            document.getElementById("eventName").innerHTML = log.event;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}

let serverDelay = 0;
if(localStorage.getItem("serverDelay") != null){
    serverDelay = parseInt(localStorage.getItem("serverDelay"));
}

let prevColor = "black";
function renderSynchronizeWindow(){
    if((!admin && !superAdmin) || eventName == null) return;
    let now = new Date().getTime() + serverDelay;
    now = Math.floor(now/1000);
    let color = prevColor;
    if(now%8 == 0) { color = "red"; }
    else if(now%6 == 0) { color = "blue"; }
    else if(now%4 == 0) { color = "yellow"; }
    else if(now%2 == 0) { color = "white"; }
    prevColor = color;
    document.getElementById("synchWindow").style.backgroundColor = color;
}
setInterval(renderSynchronizeWindow, 41); // 41ms -> 24fps

document.getElementById("clearCache").addEventListener("click", function(){
    let serverDelay = 0;
    if(localStorage.getItem("serverDelay") != null) serverDelay = localStorage.getItem("serverDelay");
    localStorage.clear();
    localStorage.setItem("serverDelay", serverDelay);
});

function youSureAboutThat(){ 
    if(confirm("This page is for the administrator and not for the timekeepers. Are you sure you want to continue?")){
        window.location.href = "index.html";
    }
}