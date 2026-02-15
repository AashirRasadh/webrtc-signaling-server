const WebSocket = require("ws");

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

const users = {};

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "register":
        users[data.userId] = ws;
        ws.userId = data.userId;
        console.log(`${data.userId} registered`);
        break;

      case "call":
      case "offer":
      case "answer":
      case "ice":
      case "hangup":
        const target = users[data.to];
        if (target) {
          target.send(JSON.stringify(data));
        }
        break;
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      delete users[ws.userId];
      console.log(`${ws.userId} disconnected`);
    }
  });
});

console.log(`Signaling server running on port ${port}`);