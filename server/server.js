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

const sessions = new Map();

console.log("WebSocket server running on ws://localhost:8080");

httpServer.listen(8080, () => {
    console.log("HTTP server running on http://localhost:8080");
});

function generateSessionCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

server.on("connection", (socket) => {
    console.log("Client connected.");

    socket.on("message", (message) => {
        const text = message.toString();

        console.log("Client says:", text);

        if (text === "create") {
            const sessionCode = generateSessionCode();

            sessions.set(sessionCode, new Set([socket]));

            console.log(`Session created: ${sessionCode}`);

            socket.send(sessionCode);
        }

        if (text.startsWith("join:")) {
            const sessionCode = text.substring(5);

            const session = sessions.get(sessionCode);

            if (session) {
                session.add(socket);

                console.log(`Client joined session: ${sessionCode}`);
            }
        }

        if (!text.startsWith("create") && !text.startsWith("join:")) {
            sessions.forEach((session) => {
                if (session.has(socket)) {
                    session.forEach((client) => {
                        if (client !== socket && client.readyState === WebSocket.OPEN) {
                            client.send(text);
                        }
                    });
                }
            });
        }

    });

    socket.on("close", () => {
        console.log("Client disconnected.");
    });

});