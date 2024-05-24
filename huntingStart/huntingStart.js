
class Server{
    constructor(){
        this.serverPath = '../server/';
        this.serverDelay = localStorage.getItem("serverDelay") != null ? parseInt(localStorage.getItem("serverDelay")) : 0;

        this.contestants = [];
        this.startTime = null;
    }
    init(){
        this.loadContestants();
    }
    loadContestants(){
        fetch(this.serverPath+'getContestants.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.contestants = log.contestants.sort((a,b) => { return b.runStart - a.runStart; });
                let newStartTime = null;
                for(var i = 0; i < this.contestants.length; i++){
                    if(this.contestants[i].runStart != 0){
                        newStartTime = this.contestants[i].runStart;
                    }
                }
                if(newStartTime != this.startTime){
                    createLineup();
                }
                this.startTime = newStartTime;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    getContestant(startNr){
        for(var i = 0; i < this.contestants.length; i++){
            if(this.contestants[i].startNr == startNr){
                return JSON.parse(JSON.stringify(this.contestants[i]));
            }
        }
        return null;
    }
    now(){
        return new Date().getTime()+this.serverDelay;
    }
}

let server = new Server();
server.init();

function createLineup(){
    let lineup = document.getElementById("lineup");
    lineup.innerHTML = "";

    for(var i = server.contestants.length-1; i >= 0; i--){
        let contestant = document.createElement("div");
        contestant.className = "lineupContestant";
        contestant.id = server.contestants[i].startNr+"display";

        let contestantName = document.createElement("div");
        contestantName.className = "lineupName";
        contestantName.innerHTML = server.contestants[i].startNr+", "+server.contestants[i].name;
        
        let contestantTime = document.createElement("div");
        contestantTime.className = "lineupTimer";
        contestantTime.setAttribute("startNr", server.contestants[i].startNr);

        contestant.appendChild(contestantName);
        contestant.appendChild(contestantTime);

        lineup.appendChild(contestant);
    }
}

function renderLoop(){
    let watch = document.getElementById("watch");
    let now = server.now();
    let startTime = server.startTime;    

    if (startTime == null){
        watch.innerHTML = "<div>"+getWatchTime(server.now())+"</div><div>--:--:--</div>";
    }
    else {
        let dt = now - startTime;
        watch.innerHTML = "<div>"+getWatchTime(server.now())+"</div><div>"+formatTime(dt, Math.abs(dt) < 5000)+"</div>";
    }
    let allContestantTimers = document.getElementsByClassName("lineupTimer");
    for(var i = 0; i < allContestantTimers.length; i++){
        let startNr = allContestantTimers[i].getAttribute("startNr");
        let contestant = server.getContestant(startNr);
        let dt = contestant.runStart - server.now();
        allContestantTimers[i].innerHTML = getCountDown(dt);
        if(dt <= 0){
            allContestantTimers[i].style.color = "yellowgreen";
        }
        if(dt <= -1000){
            document.getElementById(startNr+"display").style.display = "none";
        }
    }    
}
setInterval(renderLoop, 41); // 41ms -> 24fps

function sisyphos(){
    server.loadContestants();
}
setInterval(sisyphos, 5000);


function formatTime(ms, displayMS = false){
    var isNegative = ms < 0;
    ms = Math.abs(ms);
    let h = 60*60*1000;
    let m = 60*1000;
    let s = 1000;
    var hours = Math.floor(ms/h);
    ms -= hours*h;
    var minutes = Math.floor(ms/m);
    ms -= minutes*m;
    var seconds = Math.floor(ms/s);
    ms -= seconds*s;
    if (hours < 10) hours = "0"+hours;
    if (minutes < 10) minutes = "0"+minutes;
    if (seconds < 10) seconds = "0"+seconds;
    
    let time = (isNegative?"- ":"")+hours+":"+minutes+":"+seconds;
    if (displayMS) {
        if (ms < 10){
            ms = "00"+ms;
        } 
        else if(ms < 100){
            ms = "0"+ms;
        }
        else{
            ms = ""+ms;
        }
        time += "."+ms[0]+ms[1];
    }
    return time;
}

function getCountDown(ms){
    var isNegative = ms < 0;
    ms = Math.abs(ms);
    let h = 60*60*1000;
    let m = 60*1000;
    let s = 1000;
    var hours = Math.floor(ms/h);
    ms -= hours*h;
    var minutes = Math.floor(ms/m);
    ms -= minutes*m;
    var seconds = Math.floor(ms/s) + 1;
    ms -= seconds*s;

    if(isNegative){
        return "GO";
    }
    else if(hours){
        return hours+"H";
    }
    else if(minutes){
        return minutes+"M";
    }
    else if(seconds){
        return seconds;
    }
}

function getWatchTime(time) {
    // Create a new Date object to get UTC time

    var now = time != undefined ? new Date(time) : new Date();

    // Get UTC time components
    var hoursUTC = now.getUTCHours();
    var minutesUTC = now.getUTCMinutes();
    var secondsUTC = now.getUTCSeconds();

    // Get the user's time zone offset in minutes
    var timezoneOffsetMinutes = now.getTimezoneOffset();

    // Calculate local time components by adding the offset to UTC time
    var hours = hoursUTC - (timezoneOffsetMinutes / 60);
    var minutes = minutesUTC - timezoneOffsetMinutes % 60;
    var seconds = secondsUTC;

    // Ensure the values are within the valid range
    if (hours < 0) {
        hours += 24;
    }
    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }
    if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
    }

    // Format the time components to ensure they have two digits
    var formattedHours = ('0' + hours).slice(-2);
    var formattedMinutes = ('0' + minutes).slice(-2);
    var formattedSeconds = ('0' + seconds).slice(-2);

    // Return the formatted time as a string
    return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}


document.body.addEventListener('dblclick', toggleFullScreen);

// TODO
function toggleFullScreen() {
    
}