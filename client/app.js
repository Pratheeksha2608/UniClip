const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Browser connected to server!");
};

socket.onmessage = (event) => {
    console.log("Server says:", event.data);
};

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", () => {
    const message = messageInput.value;

    socket.send(message);
});