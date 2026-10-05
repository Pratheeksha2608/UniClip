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
const SESSION_TIMEOUT = 10 * 60 * 1000;

console.log("WebSocket server running on ws://localhost:8080");

httpServer.listen(8080, () => {
    console.log("HTTP server running on http://localhost:8080");
});

function generateSessionCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function broadcastDeviceCount(sessionCode) {
    const session = sessions.get(sessionCode);

    if (!session) {
        return;
    }

    session.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`devices:${session.clients.size}`);
        }
    });
}

function startSessionTimer(sessionCode) {
    const session = sessions.get(sessionCode);

    if (!session) {
        return;
    }

    clearTimeout(session.timeout);

    session.timeout = setTimeout(() => {
        const currentSession = sessions.get(sessionCode);

        if (!currentSession) {
            return;
        }

        currentSession.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("session-expired");
                client.sessionCode = null;
            }
        });

        sessions.delete(sessionCode);

        console.log(`Session expired: ${sessionCode}`);
    }, SESSION_TIMEOUT);
}

server.on("connection", (socket) => {
    console.log("Client connected.");

    socket.on("message", (message) => {
        const text = message.toString();

        console.log("Client says:", text);

        if (text === "create") {
            if (socket.sessionCode) {
                console.log(`Client is already in session: ${socket.sessionCode}`);
                socket.send("error:already-in-session");
                return;
            }

            const sessionCode = generateSessionCode();

            sessions.set(sessionCode, {
                clients: new Set([socket]),
                timeout: null
            });

            socket.sessionCode = sessionCode;
            startSessionTimer(sessionCode);

            console.log(`Session created: ${sessionCode}`);

            socket.send(`created:${sessionCode}:1`);
        }

        if (text.startsWith("join:")) {
            const sessionCode = text.substring(5);

            if (socket.sessionCode) {
                console.log(`Client is already in session: ${socket.sessionCode}`);
                socket.send("error:already-in-session");
                return;
            }

            const session = sessions.get(sessionCode);

            if (session) {

                session.clients.add(socket);

                socket.sessionCode = sessionCode;

                startSessionTimer(sessionCode);

                console.log(`Client joined session: ${sessionCode}`);

                console.log(`Devices in session: ${session.clients.size}`);

                broadcastDeviceCount(sessionCode);

                socket.send(`joined:${sessionCode}:${session.clients.size}`);

            } else {
                console.log(`Session not found: ${sessionCode}`);
                socket.send("error:session-not-found");
            }
        }


        if (text === "leave") {

            const sessionCode = socket.sessionCode;

            if (!sessionCode) {
                return;
            }

            const session = sessions.get(sessionCode);

            if (session) {

                session.delete(socket);

                if (session.size === 0) {
                    sessions.delete(sessionCode);
                } else {
                    broadcastDeviceCount(sessionCode);
                }

            }

            socket.sessionCode = null;

            socket.send("left");

            return;
        }


        if (!text.startsWith("create") && !text.startsWith("join:")) {
            const session = sessions.get(socket.sessionCode);

            if (session) {
                startSessionTimer(socket.sessionCode);

                session.clients.forEach((client) => {
                    if (client !== socket && client.readyState === WebSocket.OPEN) {
                        client.send(text);
                    }
                });
            }
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected.");

        const sessionCode = socket.sessionCode;
        const session = sessions.get(sessionCode);

        if (session) {
            session.clients.delete(socket);

            if (session.clients.size === 0) {
                clearTimeout(session.timeout);
                sessions.delete(sessionCode);
            } else {
                broadcastDeviceCount(sessionCode);
            }
        }
    });

});