const socket = new WebSocket("ws://localhost:8080");

let receivedText = "";

socket.onopen = () => {
    console.log("Browser connected to server!");
};

socket.onmessage = (event) => {
    console.log("Server says:", event.data);

    receivedText = event.data;
};

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", () => {
    const message = messageInput.value;

    socket.send(message);
});

const readClipboardButton = document.getElementById("readClipboardButton");
const writeClipboardButton = document.getElementById("writeClipboardButton");
const syncClipboardButton = document.getElementById("syncClipboardButton");
const copyReceivedButton = document.getElementById("copyReceivedButton");

readClipboardButton.addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();

    console.log("Clipboard:", text);
});

writeClipboardButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText("Hello from UniClip!");

    console.log("Clipboard updated!");
});

syncClipboardButton.addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();

    socket.send(text);

    console.log("Clipboard sent:", text);
});

copyReceivedButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(receivedText);

    console.log("Received text copied to clipboard!");
});