const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);

//${document.location.hostname}

let msgInput = document.getElementById("msg-bar");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");
const msg_zone = document.getElementById("msg-zone");
const msg_bar = document.getElementById("msg-bar");
const isTypingDiv = document.getElementById("isTyping");

var name = prompt("What's your name?").trim();
var nameColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
let scrollValue = 100000000;
let isTyping = false;
let userConnected = [];

while (name == "null" || name == "") {
    name = prompt("What's your name?").trim();
}

ws.onopen = function() {

    ws.send(JSON.stringify({
        type: "newConnection",
        name: name,
        nameColor: nameColor
    }));
}

ws.addEventListener("open", () => {
    console.log("We are connected");

    ws.onmessage = function(msg) {
        chat.scrollTop = scrollValue;
        var json = JSON.parse(msg.data);
        if (json.type == "newConnection") {
            msg_zone.innerHTML += `<i>${json.data} is connected.</i><br>`;
            userConnected = json.onlineUser;
        } else if (json.type == "connected") {
            msg_zone.innerHTML += `<i>You're successfully connected as ${json.data}.</i><br>`;
            userConnected = json.onlineUser;
        } else if (json.type == "nameInvalid") {

            userConnected = json.userConnected;

            while (userConnected.includes(name)) {
                name = prompt("Username already used choose another one").trim();
            }
            ws.send(JSON.stringify({
                type: "newConnection",
                name: name,
                nameColor: nameColor
            }))
        } else if (json.type == "typing") {
            if (json.name != name) {
                if (json.data == true) {
                    if (isTypingDiv.innerText !== "" && !isTypingDiv.innerHTML.includes(json.name)) {
                        isTypingDiv.innerHTML = isTypingDiv.innerHTML.replace(' is typing', `, ${json.name} is typing`);
                    } else if (isTypingDiv.innerHTML == "") {
                        isTypingDiv.innerHTML += `${json.name} is typing`;
                    }
                } else {
                    msg_zone.innerHTML += json.name
                    if (isTypingDiv.innerHTML.includes(json.name)) {
                        msg_zone.innerHTML += json.name
                        isTypingDiv.innerHTML.replace(json.name, '');
                    }
                }
            }
        } else if (json.type == "message") {
            msg_zone.innerHTML += `<div class="msg"><b style="color: ${json.nameColor}; height: fit-content">${json.name} </b><span>${json.data}</span><br></div>`;
        } else if (json.type == "LostAClient") {
            userConnected = json.data;
        }
    };
})

msg_bar.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        if (msg_bar.value !== "") {
            ws.send(JSON.stringify({
                type: "message",
                name: name,
                msg: document.getElementById("msg-bar").value,
                nameColor: nameColor
            }));
            document.getElementById("msg-bar").value = "";
        };
    }
    if (msg_bar.value !== "" && msg_bar.value != null) {
        isTyping = true;
    } else {
        isTyping = false;
    }
    ws.send(JSON.stringify({
        type: "typing",
        data: isTyping,
        name: name
    }));
});