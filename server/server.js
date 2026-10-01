const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

console.log("WebSocket server running on ws://localhost:8080");

server.on("connection", (socket) => {
    clients.add(socket);

    console.log(`Client connected. Total clients: ${clients.size}`);

    socket.send("Hello from the UniClip server!");

    socket.on("message", (message) => {
        console.log("Client says:", message.toString());

        clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
});

    socket.on("close", () => {
        clients.delete(socket);

        console.log(`Client disconnected. Total clients: ${clients.size}`);
    });
});