function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


document.getElementById("go").addEventListener("click", function(){
    setCookie("event", document.getElementById("event").value, 100);
    window.location.href = "results/";
});





async function loadRecentEvents(){
    let eventJSON = {
        status: false,
        events: [], // eventId, timestamp, 
    }

    async function getEventList(){
        fetch('server/getEventsList.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(responseJSON => {
            eventJSON = responseJSON;
        })
        .catch(error => {
            eventJSON.status = false;
        });
    } 

    let recentEvents = document.getElementById("recent_events");

    await getEventList();


    for(var i = 0; i < eventJSON.events.length; i++){
        let eventEl = document.createElement('div');
        eventEl.setAttribute("event_id", eventJSON.events[i].eventId)

        eventEl.addEventListener("click", function(){
            setCookie("event", eventEl.getAttribute("event_id"), 100);
            window.location.href = "results/index.html";
        })
    }
    
}
loadRecentEvents();