const express = require("express");
const path = require("path");
const http = require("http");
require("dotenv").config();
const socket = require("socket.io");
const app = express();
const formatMessage = require("./utils/messages");
const { joinUser, getCurrentUser } = require("./utils/users");

const server = http.createServer(app);
const io = socket(server);

const botname = "Chat Bot";

app.use(express.static(path.join(__dirname, "public")));

//main
io.on("connection", (socket) => {
  //user joining chatroom
  socket.on("room", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);
    socket.join(user.room);
    //welcome message
    socket.emit("message", formatMessage(botname, "WELCOME FROM CHAT APP"));
    //user join noti message
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${user.username} has joined the group`)
      );
  });

  //   socket.on("disconnect", () => {
  //     io.emit("message", formatMessage(botname, "A user has left the group."));
  //   });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

server.listen(process.env.PORT, (req, res) => {
  console.log("server is running on port " + process.env.PORT);
});
