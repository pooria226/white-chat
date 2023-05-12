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

  socket.on("login", ({ value, id }) => {
    console.log("users[socket.id]", users[socket.id]);
    console.log("id", id);
    if (users[socket.id]) {
      if (users[socket.id] != id) {
        users[socket.id] = { id: socket.id, online: true, userName: value };
      }
    } else {
      users[socket.id] = { id: socket.id, online: true, userName: value };
    }

    io.emit("onlines", { users });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});
