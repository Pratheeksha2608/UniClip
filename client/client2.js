const WebSocket = require("ws");
const readline = require("readline");

const socket = new WebSocket("ws://localhost:8080");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on("open", () => {
    console.log("Connected to server!");
    console.log("Type a message and press Enter:");
});

socket.on("message", (message) => {
    console.log("\nReceived:", message.toString());
    console.log("Type a message and press Enter:");
});

rl.on("line", (input) => {
    socket.send(input);
});