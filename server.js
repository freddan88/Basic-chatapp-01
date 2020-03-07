const dotenv = require("dotenv");
const express = require("express");
const http = require("http").Server(express);
const io = require("socket.io")(http);
const path = require("path");
const app = express();

dotenv.config({ path: "./config.env" });
const port = 3002;

io.on("connection", socket => {
  console.log(`A user connected with ID: ${socket.id}`);

  socket.on("chat message", message => {
    io.emit("chat message", message);
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
