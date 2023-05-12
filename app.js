const http = require("http");

const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Static folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Setup Socket

const users = {};

io.on("connection", (socket) => {
  socket.on("send message", (data) => {
    io.emit("send message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("login", ({ value }) => {
    users[socket.id] = { id: socket.id, online: true, userName: value };
    io.emit("login", { users });
  });

  socket.on("disconnect", () => {
    if (!users[socket.id]?.userName) {
      delete users[socket.id];
    } else {
      users[socket.id] = { ...users[socket.id], online: false };
    }
  });
});
