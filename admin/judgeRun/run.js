let selectedTime = null;
class Server{
    constructor(){
        this.serverPath = '../../server/';
        this.serverDelay = localStorage.getItem("serverDelay") != null ? parseInt(localStorage.getItem("serverDelay")) : 0;
        this.connected = false;

        this.contestants = [];
        this.initiated = false;
    }
    init(){
        if(this.connected) return;
        this.loadContestants();
    }

    loadContestants(redraw = true){
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
                this.contestants = log.contestants.sort((a,b) => { return a.startNr - b.startNr; });
                if(redraw){
                    createAssignParticipantOptions();
                    renderRegisteredTimes();
                }                              
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    registerTime(startNr, timestamp){
        const data = {
            startNr: startNr,
            time: timestamp
        };
        fetch(this.serverPath+'setRunTime.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.loadContestants();
                hideForeground();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
        
    }
    isAssigned(time){
        for(var i = 0; i < this.contestants.length; i++){
            if (this.contestants[i].runEnd == time) return true;
        }
        return false;
    }
    now(){
        return new Date().getTime()+this.serverDelay;
    }
}

let server = new Server();
server.init();

function sisyphos(){
    server.loadContestants(false); // Synchronize data between users
}
setInterval(sisyphos, 5000);

function hideForeground(){
    document.getElementById("foreground").style.display = "none";
}
document.getElementById("foreground_exit").addEventListener("click", hideForeground);

function clearForeground(){
    let foreground = document.getElementById("foreground");
    foreground.style.display = "flex";
    let children = foreground.children;
    for(var i = 0; i < children.length; i++){
        children[i].style.display = "none";
    }
}

function createAssignParticipantOptions(){
    if(server.contestants.length == 0) return;

    let participantsEl = document.getElementById("assign_contestant");
    participantsEl.innerHTML = "";

    for(var i = 0; i < server.contestants.length; i++){ 
        let runner = document.createElement("div");
        runner.setAttribute("startNr", server.contestants[i].startNr);
        let runnerEndTime = server.contestants[i].runEnd;
        runner.style.backgroundColor = runnerEndTime != 0 ? "green" : "rgba(255,255,255,0.5)";
        runner.innerHTML = server.contestants[i].startNr+((runnerEndTime != 0) ? ", "+getWatchTime(runnerEndTime):""); // +server.contestants[i].name
        runner.addEventListener("click", function(){
            let startNr = parseInt(this.getAttribute("startNr"));
            server.registerTime(startNr, selectedTime);
            hideForeground();
        });
        participantsEl.appendChild(runner);
    }
}

function getStartTime(){
    let startTime = null;
    let contestants = JSON.parse(JSON.stringify(server.contestants));
    contestants = contestants.sort((a,b) => { return a.runStart - b.runStart; });

    for(var i = 0; i < contestants.length; i++){
        if(contestants[i].runStart != 0){
            return contestants[i].runStart;
        }
    }
    
    return startTime;
}

function renderStatus(){
    let watch = document.getElementById("watch");
    let mainButton = document.getElementById("register_time");
    let now = server.now();
    let startTime = getStartTime();    

    if (startTime == null){
        mainButton.style.backgroundColor = "black";
        watch.innerHTML = "<div>"+getWatchTime(server.now())+"</div><div>--:--:--</div>";
    }
    else {
        let dt = now - startTime;
        if(dt < 0){        
            watch.innerHTML = "<div>"+getWatchTime(server.now())+"</div><div>"+formatTime(dt, Math.abs(dt) < 5000)+"</div>";
            mainButton.style.backgroundColor = "black";
        }
        else if(dt > 0){
            watch.innerHTML = "<div>"+getWatchTime(server.now())+"</div><div>"+formatTime(dt, Math.abs(dt) < 5000)+"</div>";
            mainButton.style.backgroundColor = "green";
        }
    }
    
}
setInterval(renderStatus, 41); // 41ms -> 24fps



function registerTime(){
    let now = server.now();
    let startTime = getStartTime();
    if (startTime == null || now < startTime) return;   

    let list = [];
    if(localStorage.getItem("runTimes") != null){
        list = JSON.parse(localStorage.getItem("runTimes"));
    }
    list.push(now);    
    localStorage.setItem("runTimes", JSON.stringify(list));
    renderRegisteredTimes();
}
document.getElementById("register_time").addEventListener("click", registerTime);

function renderRegisteredTimes(){
    let startTime = getStartTime();
    if(startTime == 0 || startTime == null || startTime > server.now()) return;

    let list = [];
    if(localStorage.getItem("runTimes") != null){
        list = JSON.parse(localStorage.getItem("runTimes"));
    }

    let listEl = document.getElementById("registered_times");
    listEl.innerHTML = "";
    for(var i = 0; i < list.length; i++){
        if(list[i] < startTime) continue;
        let time = document.createElement("div");        
        time.innerHTML = getWatchTime(list[i])+"  ["+formatTime(list[i] - startTime, true)+"]";
        time.style.border = "2px solid "+(server.isAssigned(list[i])?"orange":"black"); 
        time.setAttribute("time", list[i]);
        time.addEventListener("click", function(){
            selectedTime = parseInt(this.getAttribute("time"));
            clearForeground();
            document.getElementById("foreground").style.display = "flex";
            document.getElementById("assign_contestant").style.display = "flex";
        });
        listEl.appendChild(time);
    }
}

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