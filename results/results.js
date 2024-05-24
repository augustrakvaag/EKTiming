class Server{
    constructor(){
        this.serverPath = '../server/';
        this.serverDelay = localStorage.getItem("serverDelay") != null ? parseInt(localStorage.getItem("serverDelay")) : 0;
        this.connected = false;

        this.heats = [];
        this.lanes = [];
        this.contestants = [];

        this.startTime = 0;
        this.ended = false;
    }
    init(){
        this.loadHeatLanes();
        this.loadContestants();
    }

    loadHeatLanes(){
        fetch(this.serverPath+'getSwimInformation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.connected = true;
                this.lanes = log.lanes;
                this.heats = log.heats;
                renderHeatSelector();
            }
            else{
                window.location.href = "../";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
                this.contestants = log.contestants;
                renderResults();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
let server = new Server();
server.init();

document.getElementById("refresh").addEventListener("click", function(){server.loadContestants();});

document.getElementById("heats").addEventListener("change", renderResults);
document.getElementById("names").addEventListener("click", renderResults);
let allSortOptions = document.getElementsByName("sort");
for(var i = 0; i < allSortOptions.length; i++){
    allSortOptions[i].addEventListener("click", renderResults);
}
document.getElementById("placement").addEventListener("click", renderResults);

function renderHeatSelector(){
    let heatsEl = document.getElementById("heats")
    heatsEl.innerHTML = "<option value='0'>All</option>";
    for(var i = 0; i < server.heats.length; i++){
        heatsEl.innerHTML += "<option value='"+server.heats[i]+"'>"+server.heats[i]+"</option>";
    }
}

let selectedSortFunction = 1;

document.getElementById("sortByName").addEventListener("click", function(){ 
    selectedSortFunction = 4;
    renderResults();
});
document.getElementById("sortBySwimTime").addEventListener("click", function(){ 
    selectedSortFunction = 2;
    renderResults();
});
document.getElementById("sortByRunTime").addEventListener("click", function(){ 
    selectedSortFunction = 3;
    renderResults();
});
document.getElementById("sortByTime").addEventListener("click", function(){ 
    selectedSortFunction = 1;
    renderResults();
});
document.getElementById("sortByStartNr").addEventListener("click", function(){ 
    selectedSortFunction = 5;
    renderResults();
});

function comparisonFunction(a,b){
    let sortFunction = selectedSortFunction;
    // TODO: move all zero enteries to the back
    switch(sortFunction){
        case 1:
            let aTimeTotal = a.swimTime;
            let bTimeTotal = b.swimTime;
            if(a.runTime == 0){ aTimeTotal = 0; }
            else{ aTimeTotal += a.runTime}
            if(a.swimTime == 0){ aTimeTotal = 0; }
            
            if(b.runTime == 0){ bTimeTotal = 0; }
            else{ bTimeTotal += b.runTime}
            if(b.swimTime == 0){ bTimeTotal = 0; }

            if (aTimeTotal === 0 && bTimeTotal === 0) {
                return 0;
            } else if (aTimeTotal === 0) {
                return 1; 
            } else if (bTimeTotal === 0) {
                return -1;
            } else {
                return aTimeTotal - bTimeTotal;
            }
        case 2:
            if (a.swimTime === 0 && b.swimTime === 0) {
                return 0;
            } else if (a.swimTime === 0) {
                return 1; 
            } else if (b.swimTime === 0) {
                return -1;
            } else {
                return a.swimTime - b.swimTime;
            }
        case 3:
            if (a.runTime === 0 && b.runTime === 0) {
                return 0;
            } else if (a.runTime === 0) {
                return 1; 
            } else if (b.runTime === 0) {
                return -1;
            } else {
                return a.runTime - b.runTime;
            }
        case 4:
            let astring = a.name.toLocaleLowerCase();
            let bstring = b.name.toLocaleLowerCase();
            return astring.localeCompare(bstring);
        case 5:
            return a.startNr - b.startNr;
    }
}

function renderResults(){  
    let contestants = JSON.parse(JSON.stringify(server.contestants));
    if(selectedSortFunction == 1){
        selectedSortFunction = 2;
        contestants = contestants.sort(comparisonFunction);
        selectedSortFunction = 1;
    }
    contestants = contestants.sort(comparisonFunction);

    let resultEl = document.getElementById("resultsTableContent");
    resultEl.innerHTML = "";
    let heat = document.getElementById("heats").value;
    let showNames = document.getElementById("names").checked;

    let showPlacement = document.getElementById("placement").checked;

    document.getElementById("showPlacement").style.display = showPlacement ? "flex" : "none";
    document.getElementById("sortByName").style.display = showNames ? "flex" : "none";

    const tl = "tableLine";

    for(var i  = 0; i < contestants.length; i++){
        if((contestants[i].heat == heat || heat == 0)){
            let contestant = document.createElement("div");
            contestant.className = "tableLine";

            let place = document.createElement("div");
            place.className = tl+"Placement";
            place.innerHTML = (i+1);
            place.style.display = showPlacement ? "flex" : "none";

            let startNr = document.createElement("div");
            startNr.className = tl+"StartNr";
            startNr.innerHTML = contestants[i].startNr;

            let name = document.createElement("div");
            name.className = tl+"Name";
            name.innerHTML = contestants[i].name;
            name.style.display = showNames ? "flex" : "none";

            let swimTime = document.createElement("div");
            swimTime.className = tl+"SwimTime";
            swimTime.innerHTML = contestants[i].swimTime != 0 ? formatTime(contestants[i].swimTime, true) : "--:--:--.--";

            let runTime = document.createElement("div");
            runTime.className = tl+"RunTime";
            runTime.innerHTML = contestants[i].runTime != 0 ? formatTime(contestants[i].runTime, true) : "--:--:--.--";
            
            let totalTime = document.createElement("div");
            totalTime.className = tl+"TotalTime";
            let totalTimeValue = contestants[i].swimTime;
            if(contestants[i].runTime == 0) { totalTimeValue = 0; }
            else { totalTimeValue += contestants[i].runTime; }
            if(contestants[i].swimTime == 0) { totalTimeValue = 0; }
            totalTime.innerHTML = totalTimeValue != 0 ? formatTime(totalTimeValue, true) : "--:--:--.--";

            contestant.appendChild(place);
            contestant.appendChild(startNr);
            contestant.appendChild(name);
            contestant.appendChild(swimTime);
            contestant.appendChild(runTime);
            contestant.appendChild(totalTime);
            
            resultEl.appendChild(contestant);
        }
    }
}

function download(){
    var data = [["Place", "Start Nr", "Name", "Swim Time", "Run Time", "Total Time"]];

    let contestants = JSON.parse(JSON.stringify(server.contestants));
    selectedSortFunction = 2;
    contestants = contestants.sort(comparisonFunction);
    selectedSortFunction = 1;
    contestants = contestants.sort(comparisonFunction);
    
    
    for(var i = 0; i < contestants.length; i++){
        let dataLine = [];

        let swimTime = contestants[i].swimTime;
        swimTime = swimTime ? formatTime(swimTime, true) : "--:--:--.--";

        let runTime = contestants[i].runTime;
        runTime = runTime ? formatTime(runTime, true) : "--:--:--.--";

        let timeTotal = contestants[i].swimTime;
        if(contestants[i].runTime == 0) { timeTotal = 0; }
        else { timeTotal += contestants[i].runTime; }
        if(contestants[i].swimTime == 0){ timeTotal = 0;}
        timeTotal = timeTotal ? formatTime(timeTotal, true) : "--:--:--.--";

        dataLine.push(i+1);
        dataLine.push(contestants[i].startNr);
        dataLine.push(contestants[i].name);
        dataLine.push(swimTime);
        dataLine.push(runTime);
        dataLine.push(timeTotal);
        data.push(dataLine);
    }

    var workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Results");
    workbook.Sheets["Results"] = XLSX.utils.aoa_to_sheet(data);

    XLSX.writeFile(workbook, "results.xlsx");

    renderResults();
}
document.getElementById("download").addEventListener("click", download);

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