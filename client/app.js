let socket;

function connectWebSocket() {

    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {

        console.log("Browser connected to server!");

        if (currentSessionCode) {

            socket.send(`join:${currentSessionCode}`);

        }

    };

    socket.onclose = () => {

        inSession = false;

        sessionState.textContent = "Not in a session";

        sessionStatus.textContent = "Disconnected from server.";

        sessionMessage.textContent = "";

        setTimeout(() => {

            connectWebSocket();

        }, 2000);

    };

    socket.onmessage = (event) => {
        console.log("Server says:", event.data);

        if (event.data.startsWith("created:")) {
            const parts = event.data.split(":");

            const sessionCode = parts[1];
            const deviceCount = parts[2];

            currentSessionCode = sessionCode;

            sessionStatus.textContent = `Session Code: ${sessionCode} | Devices: ${deviceCount}`;

            inSession = true;
            sessionState.textContent = "In a session";
            sessionMessage.textContent = "";

            return;
        }

        if (event.data.startsWith("joined:")) {
            const parts = event.data.split(":");

            const sessionCode = parts[1];
            const deviceCount = parts[2];

            currentSessionCode = sessionCode;

            sessionStatus.textContent = `Joined Session: ${sessionCode} | Devices: ${deviceCount}`;

            inSession = true;
            sessionState.textContent = "In a session";
            sessionMessage.textContent = "";

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

        if (event.data === "error:session-not-found") {
            sessionStatus.textContent = "Session not found. Check the session code.";
            return;
        }

        if (event.data === "error:already-in-session") {

            sessionMessage.textContent = "Already in a session. Leave your current session first.";

            return;
        }

        if (event.data === "left") {

            inSession = false;
            currentSessionCode = null;

            sessionState.textContent = "Not in a session";

            sessionStatus.textContent = "You left the session.";
            sessionMessage.textContent = "";

            return;
        }

        clipboardHistory.push({
            text: event.data,
            direction: "received"
        });

        renderClipboardHistory();

        console.log("Clipboard history:", clipboardHistory);
    };

}

connectWebSocket();

let clipboardHistory = [];

let inSession = false;
let currentSessionCode = null;

const createSessionButton = document.getElementById("createSessionButton");
const sessionStatus = document.getElementById("sessionStatus");
const sessionState = document.getElementById("sessionState");
const sessionMessage = document.getElementById("sessionMessage");
const clipboardHistoryElement = document.getElementById("clipboardHistory");
const clearHistoryButton = document.getElementById("clearHistoryButton");

const sessionCodeInput = document.getElementById("sessionCodeInput");
const joinSessionButton = document.getElementById("joinSessionButton");
const leaveSessionButton = document.getElementById("leaveSessionButton");

createSessionButton.addEventListener("click", () => {
    socket.send("create");
});

joinSessionButton.addEventListener("click", () => {

    const sessionCode = sessionCodeInput.value.trim();

    if (sessionCode === "") {
        sessionStatus.textContent = "Please enter a session code.";
        return;
    }

    if (!/^\d{6}$/.test(sessionCode)) {
        sessionStatus.textContent = "Session code must be 6 digits.";
        return;
    }

    socket.send(`join:${sessionCode}`);
});

leaveSessionButton.addEventListener("click", () => {

    socket.send("leave");

});

function renderClipboardHistory() {
    clipboardHistoryElement.innerHTML = "";

    clipboardHistory.forEach((entry, index) => {
        const item = document.createElement("p");

        item.textContent = `${entry.text} [${entry.direction}]`;

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";

        copyButton.addEventListener("click", async () => {
            await navigator.clipboard.writeText(entry.text);
            console.log("Copied from history:", entry.text);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            clipboardHistory.splice(index, 1);
            renderClipboardHistory();
        });

        item.appendChild(copyButton);

        item.appendChild(deleteButton);

        clipboardHistoryElement.appendChild(item);
    });
}

clearHistoryButton.addEventListener("click", () => {
            clipboardHistory = [];
            renderClipboardHistory();
        });

const syncClipboardButton = document.getElementById("syncClipboardButton");

syncClipboardButton.addEventListener("click", async () => {

    if (!inSession) {
        sessionStatus.textContent = "Create or join a session first.";
        return;
    }

    const text = await navigator.clipboard.readText();

    clipboardHistory.push({
        text: text,
        direction: "sent"
    });

    renderClipboardHistory();

    socket.send(text);

    console.log("Clipboard sent:", text);
});