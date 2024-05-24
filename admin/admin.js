let timerOn = false;

class Server{
    constructor(){
        this.serverPath = '../server/';
        this.serverDelay = localStorage.getItem("serverDelay") != null ? parseInt(localStorage.getItem("serverDelay")) : 0;
        this.connected = false;
        this.heats = [];
        this.lanes = [];
        this.startTime = null;
    }
    init(){
        const data = {};
        fetch(this.serverPath+'getSwimInformation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            document.getElementById("loading").style.display = "none";
            if(!log.admin){
                window.location.href = "checkin.php";
            }
            if(log.success){
                document.getElementById("loading").style.display = "none";
                document.getElementById("eventName").innerHTML = log.event;
                let heatsEl = document.getElementById("heats");
                let lanesEl = document.getElementById("lanes");

                this.lanes = log.lanes;
                this.heats = log.heats;


                heatsEl.innerHTML = "";
                for(var i = 0; i < this.heats.length; i++){
                    let heat = document.createElement("div");
                    heat.className = "heat";
                    heat.setAttribute("state", "off");
                    heat.setAttribute("value", this.heats[i]);
                    heat.innerHTML = this.heats[i];
                    heat.addEventListener("click", function(){
                        let allHeats = document.getElementsByClassName("heat");
                        for(var j = 0; j <allHeats.length; j++){
                            allHeats[j].setAttribute("state", "off");
                            allHeats[j].style.borderColor = "white";
                        }
                        this.setAttribute("state", "on");
                        this.style.borderColor = "yellowgreen";
                    });
                    heatsEl.appendChild(heat);
                }

                lanesEl.innerHTML = "";
                for(var i = 0; i < this.lanes.length; i++){
                    let lane = document.createElement("div");
                    lane.className = "lane";
                    lane.setAttribute("state", "on");
                    lane.style.borderColor = "yellowgreen";
                    lane.setAttribute("value", this.lanes[i]);
                    lane.innerHTML = this.lanes[i];
                    lane.addEventListener("click", function(){
                        if(this.getAttribute("state") == "on"){
                            this.setAttribute("state", "off");
                            this.style.borderColor = "white";
                        }
                        else{
                            this.setAttribute("state", "on");
                            this.style.borderColor = "yellowgreen";
                        }
                    });
                    lanesEl.appendChild(lane);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    setStartTime(heats, lanes, time){
        if(heats.length == 0){
            alert("You must select a heat to start");
            return;
        } 
        if(lanes.length == 0){
            alert("You must select lane(s) to start");
            return;
        }
        const data = {
            heats: heats,
            lanes: lanes,
            time: time
        };
        fetch(this.serverPath+'setSwimStartTime.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.startTime = time;
                timerOn = true;
            }
            else{
                timerOn = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    resetHeats(heats){
        const data = {
            heats: heats
        };
        fetch(this.serverPath+'resetSwimHeats.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                timerOn = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    endHeatLane(heats, lanes){
        const data = {
            heats: heats,
            lanes: lanes
        };
        fetch(this.serverPath+'setSwimEnd.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                timerOn = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    generateRunStartTime(){
        let data = getRunStartData(); 

        if(!data.isValid){
            alert("Incorrectly formated values");
            return;
        }
        data.startTime += this.serverDelay;
        
        fetch(this.serverPath+'setRunStartTime.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            console.log(log);
            if(log.success){
                timerOn = false;
                alert("Start Times Automatically generated");
            }
            else{
                alert("Something went wrong [Check if the Start List is allready generated]");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }
    now(){
        return new Date().getTime()+this.serverDelay;
    }
}

let server = new Server();
server.init();

function getSelectedHeatsLanes(){
    let lanes = [];
    let heats = [];
    let allHeatsEl = document.getElementsByClassName("heat");
    let allLanesEl = document.getElementsByClassName("lane");

    for(var i = 0; i < allHeatsEl.length; i++){
        if(allHeatsEl[i].getAttribute("state") == "on"){
            heats.push(allHeatsEl[i].getAttribute("value"));
        }
    }
    for(var i = 0; i <allLanesEl.length; i++){
        if(allLanesEl[i].getAttribute("state") == "on"){
            lanes.push(parseInt(allLanesEl[i].getAttribute("value")));
        }
    }
    return {heats: heats, lanes: lanes};
}

document.getElementById("start").addEventListener("click", function(){
    let heatLanes = getSelectedHeatsLanes();
    let secondsFromNow = 10;
    server.setStartTime(heatLanes.heats, heatLanes.lanes, server.now()+secondsFromNow*1000);
});

// TODO
// document.getElementById("reset").addEventListener("dblclick", function(){
//     if(!confirm("Are you sure you want to reset the selected heats?")) return;

//     let heatLanes = getSelectedHeatsLanes();
//     server.resetHeats(heatLanes.heats);
// });

document.getElementById("end").addEventListener("click", function(){
    let heatLanes = getSelectedHeatsLanes();
    server.endHeatLane(heatLanes.heats, heatLanes.lanes);
});

function renderTimer(){
    if (!timerOn){
        document.getElementById("timer").innerHTML = "00:00:00.00";
        return;
    }
    let dt = server.now() - server.startTime;
    document.getElementById("timer").innerHTML = formatTime(dt, (Math.abs(dt)<5000));
}
setInterval(renderTimer, 41);

function getRunStartData(){
    let data = {};
    data.isValid = true;
    data.startTime = null;
    data.huntPeriod = null;
    data.intervalTime = null;

    let startTime = parseTime(document.getElementById("runStartTime").value);
    let huntPeriod = parseTime(document.getElementById("huntPeriod").value);
    let intervalTime = parseTime(document.getElementById("intervalTime").value);

    if(startTime == -1 || huntPeriod == -1 || intervalTime == -1){
        data.isValid = false;
        return data;
    }

    data.startTime = startTime;
    data.huntPeriod = huntPeriod;
    data.intervalTime = intervalTime;
    return data;
}

document.getElementById("generateRunStartTime").addEventListener("click", function(){
    server.generateRunStartTime();
});

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


function parseTime(input) {
    const regex = /^(\d+):(\d+):(\d+)$/;
    const match = input.match(regex);

    if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseInt(match[3]);

        const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
        return totalMilliseconds;
    } else {
        return -1;
    }
}

document.getElementById("clearCache").addEventListener("click", function(){
    let serverDelay = 0;
    if(localStorage.getItem("serverDelay") != null) serverDelay = localStorage.getItem("serverDelay");
    localStorage.clear();
    localStorage.setItem("serverDelay", serverDelay);
});