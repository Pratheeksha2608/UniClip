const socket = new WebSocket("ws://localhost:8080");

let receivedText = "";

let creatingSession = false;

const createSessionButton = document.getElementById("createSessionButton");
const sessionStatus = document.getElementById("sessionStatus");

const sessionCodeInput = document.getElementById("sessionCodeInput");
const joinSessionButton = document.getElementById("joinSessionButton");

createSessionButton.addEventListener("click", () => {
    creatingSession = true;
    socket.send("create");
});

joinSessionButton.addEventListener("click", () => {
    const sessionCode = sessionCodeInput.value;

    socket.send(`join:${sessionCode}`);
});

socket.onopen = () => {
    console.log("Browser connected to server!");
};

socket.onmessage = (event) => {
    console.log("Server says:", event.data);

    if (event.data.startsWith("created:")) {
        const parts = event.data.split(":");

        const sessionCode = parts[1];
        const deviceCount = parts[2];

        sessionStatus.textContent = `Session Code: ${sessionCode} | Devices: ${deviceCount}`;

        creatingSession = false;
        return;
    }

    if (event.data.startsWith("joined:")) {
        const parts = event.data.split(":");

        const sessionCode = parts[1];
        const deviceCount = parts[2];

        sessionStatus.textContent = `Joined Session: ${sessionCode} | Devices: ${deviceCount}`;
        return;
    }

    if (event.data.startsWith("devices:")) {
        const deviceCount = event.data.substring(8);

        sessionStatus.textContent = sessionStatus.textContent.replace(
            / \| Devices: \d+/,
        ""
        );

        sessionStatus.textContent += ` | Devices: ${deviceCount}`;
        return;
    }

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