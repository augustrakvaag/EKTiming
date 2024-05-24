document.getElementById("template").addEventListener("click", function(){
    console.log("Downloading template");
    window.location.href = "event_template.xlsx";
});

// TODO BEYOND THIS LINE
function step1(){
    fetch('../../server/constructEvent.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
function step2(){
    let data = {
        eid: "",
        heats: [],
        lanes: []
    };   
    // TODO: Populate data
    fetch('../../server/constructHeatLaneStructure.php', {
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
            alert("Event generated, redirecting to control panel");
            window.location.href = "../";
        }
        else{
            alert("Request failed, make sure you are loged in as a super admin");
        }
    })
    .catch(error => {
        alert('Error:', error);
    });
}

function step3(){
    for(contestant in contestants){

    }
}
