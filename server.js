const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    const file = req.url === "/" ? "/controller.html" : req.url;
    fs.readFile("." + file, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end();
        }
        res.end(data);
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', msg => {
        // broadcast to all clients (including TV)
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) client.send(msg.toString());
        });
    });
});


server.listen(3000, () => {
    console.log("Open http://104.188.238.87:3000");
});
