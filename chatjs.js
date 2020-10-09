const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);

//${document.location.hostname}

const msgInput = document.getElementById("text");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");

var name = prompt("What's your name?");

let username;

ws.onopen = function() {

    username = name;

    ws.send(JSON.stringify({
        type: "newConnection",
        nick: username
    }));
}

ws.addEventListener("open", () => {
    console.log("We are connected");

    ws.onmessage = function(msg){
        var json = JSON.parse(msg.data);
        if (json.type == "newConnection") {
            chat.innerHTML += `<i>${json.data} is connected.</i><br>`;
        } else if (json.type == "connected") {
            chat.innerHTML += `<i>You're successfully connected as ${json.data}.</i><br>`;
        } else {
            chat.innerHTML += `<div id="message">${json.name} : ${json.data}<br></div>`;
        }
    };
})

sendButton.addEventListener("click", function() {
    if(msgInput.value != ""){
        ws.send(JSON.stringify({
            type: "message",
            nick: username,
            msg: msgInput.value
        }));
        msgInput.value = "";
    };
});