const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const httpServer = http.createServer((req, res) => {
    console.log("Browser requested:", req.url);

    // app.js handling
    if (req.url === "/app.js") {
        fs.readFile("client/app.js", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading JavaScript");
                return;
            }

            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(data);
        });

        return;
    }

    // index.html handling
    fs.readFile("client/index.html", (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Error loading page");
            return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

const server = new WebSocket.Server({ server: httpServer });

const clients = new Set();

console.log("WebSocket server running on ws://localhost:8080");

httpServer.listen(8080, () => {
    console.log("HTTP server running on http://localhost:8080");
});

server.on("connection", (socket) => {
    clients.add(socket);

    console.log(`Client connected. Total clients: ${clients.size}`);

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