const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);

//${document.location.hostname}

let msgInput = document.getElementById("msg-bar");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");
const msg_zone = document.getElementById("msg-zone");


var name = prompt("What's your name?");
var nameColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";

while(name == "null" || name == ""){
    name = prompt("What's your name?");
}

let username;

ws.onopen = function() {

    username = name;

    ws.send(JSON.stringify({
        type: "newConnection",
        nick: username,
        nameColor: nameColor
    }));
}

ws.addEventListener("open", () => {
    console.log("We are connected");

    ws.onmessage = function(msg){
        var json = JSON.parse(msg.data);
        if (json.type == "newConnection") {
            msg_zone.innerHTML += `<i>${json.data} is connected.</i><br>`;
        } else if (json.type == "connected") {
            msg_zone.innerHTML += `<i>You're successfully connected as ${json.data}.</i><br>`;
        } else {
            msg_zone.innerHTML += `<div class="msg"><b style="color: ${json.nameColor}; height: fit-content">${json.name}</b> : ${json.data}<br></div>`;
        }
    };
})

chat.addEventListener('keydown', function(event) {
    if(event.key == "Enter"){
        if(document.getElementById("msg-bar").value !== ""){
            ws.send(JSON.stringify({
                type: "message",
                nick: username,
                msg: document.getElementById("msg-bar").value,
                nameColor: nameColor
            }));
            document.getElementById("msg-bar").value = "";
        };
    }
});