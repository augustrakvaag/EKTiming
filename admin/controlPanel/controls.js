class Server{
    constructor(){
        this.serverPath = '../../server/';
        this.serverDelay = localStorage.getItem("serverDelay") != null ? parseInt(localStorage.getItem("serverDelay")) : 0;
        this.connected = false;
        this.heatLanes = [];
        this.contestants = [];
    }
    init(){
        fetch(this.serverPath+'getAdminInformation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(log => {
            if(!log.admin){
                window.location.href = "../checkin.php";
            }
            if(log.success){
                this.heatLanes = log.heatLanes;
                this.contestants = log.contestants;
                document.getElementById("event").innerHTML = log.event;
                renderContestants();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    deleteContestant(data){
        fetch(this.serverPath+'deleteContestant.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.init();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    addContestant(data){  
        fetch(this.serverPath+'addContestant.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.init();
                document.getElementById("name").value = "";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    updateContestant(data){     
        console.log(data);   
        fetch(this.serverPath+'setContestant.php', {
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
                this.init()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    createHeatLanes(data){
        fetch(this.serverPath+'resetRun.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                this.init();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    resetRun(){
        fetch(this.serverPath+'resetRun.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                alert("Run Times Reset");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    resetSwim(){    
        fetch(this.serverPath+'resetSwim.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(log => {
            if(log.success){
                alert("Swim Times Reset");
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

function renderContestants(){
    let contestants = document.getElementById("contestants");
    contestants.innerHTML = "";

    let advanced = false; // document.getElementById("advanced").checked;

    for(var i = 0; i < server.contestants.length; i++){
        let contestant = document.createElement('div');

        // Create input element for Start Nr.
        let startNrInput = document.createElement('input');
        startNrInput.type = 'number';
        startNrInput.placeholder = 'Start Nr.';
        startNrInput.name = 'startNr';
        startNrInput.value = server.contestants[i].startNr;
        startNrInput.style.width = "70px";

        // Create input element for Full Name
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Full Name';
        nameInput.name = 'name';
        nameInput.value = server.contestants[i].name;

        // Create select element for Heat Lane
        let heatLaneSelect = document.createElement('select');
        heatLaneSelect.name = 'heatLane';

        // Loop through the options and create option elements
        server.heatLanes.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option.hid;
            optionElement.selected = option.hid == server.contestants[i].hid;
            optionElement.textContent = option.heat + " - " + option.lane;
            heatLaneSelect.appendChild(optionElement);
        });

        // Create input element for Run Start Time
        let runStartTimeInput = document.createElement('input');
        runStartTimeInput.type = 'number';
        runStartTimeInput.placeholder = 'Run Start Time [ms]';
        runStartTimeInput.name = 'runStartTime';
        runStartTimeInput.value = server.contestants[i].runStartTime;

        // Create button element
        let updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.setAttribute("index", JSON.parse(i));
        updateButton.addEventListener("click", function(){
            let index = this.getAttribute("index");
            // console.log(server.contestants[index]);
            let data = { 
                isValid: true,
                cid: server.contestants[index].cid
            };
            if(Number.isInteger(parseInt(startNrInput.value))){
                data.startNr = parseInt(startNrInput.value);
            }
            else{
                data.isValid = false;
            }
            data.name = nameInput.value;
            data.hid = parseInt(heatLaneSelect.value);
            if(Number.isInteger(parseInt(runStartTimeInput.value))){
                data.runStartTime = parseInt(runStartTimeInput.value);
            }
            else{
                data.isValid = false;
            }
            if(!data.isValid){
                alert("Data incorectly formated");
                return;
            }
            server.updateContestant(data);
        });

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute("index", JSON.parse(i));
        deleteButton.addEventListener("click", function(){
            const index = this.getAttribute("index");
            const data = {cid: server.contestants[index].cid};
            server.deleteContestant(data);
        })


        // Append all elements to the contestant div
        contestant.appendChild(startNrInput);
        contestant.appendChild(nameInput);
        contestant.appendChild(heatLaneSelect);
        if(advanced){ 
            // CONSIDER: Adding the rest
            contestant.appendChild(runStartTimeInput);
        }        
        contestant.appendChild(updateButton);
        contestant.appendChild(deleteButton);

        contestants.appendChild(contestant);
    }
}
//document.getElementById("advanced").addEventListener("click", renderContestants);
document.getElementById("resetSwim").addEventListener("dblclick", function(){server.resetSwim();})
document.getElementById("resetRun").addEventListener("dblclick", function(){server.resetRun();})

document.getElementById("add").addEventListener("click", function(){
    const data = {name: document.getElementById("name").value};
    server.addContestant(data);
});

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

document.getElementById("manual_swimBT").addEventListener("click", function(){

    var time = parseTime(document.getElementById("manual_swimTime").value);
    if (time == -1) {
        alert("Time formated incorrectly");
        return;
    }

    time++;

    const data = {
        startNr: document.getElementById("manual_startNr").value,
        time: time
    }
    fetch(server.serverPath+'setManualSwimTime.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(log => {
        if(log.success){
            alert("Swim time for contestant with start nr.: "+data.startNr+" registered");
        }
        else{
            alert("Swim time registration failed, try again");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById("manual_runBT").addEventListener("click", function(){

    var time = parseTime(document.getElementById("manual_runTime").value);
    if (time == -1) {
        alert("Time formated incorrectly");
        return;
    }
    
    time++;

    const data = {
        startNr: document.getElementById("manual_startNr").value,
        time: time
    }
    fetch(server.serverPath+'setManualRunTime.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(log => {
        if(log.success){
            alert("Run time for contestant with start nr.: "+data.startNr+" registered");
        }
        else{
            alert("Run time registration failed, try again");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});