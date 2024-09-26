import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";

const app = express(); // express 초기화
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*", // 모든 출처에서의 연결 허용
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(socket.id, "connected");
  socket.on("username", (nickname) => {
    connectedUsers.set(socket.id, nickname);
    io.emit("allUsers", Array.from(connectedUsers.values())); // 모든 클라이언트에 사용자 목록 전송
  });

  io.emit("allUsers", Array.from(connectedUsers));

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
    connectedUsers.delete(socket.id);
    io.emit("allUsers", Array.from(connectedUsers));
  });
});

server.listen(8080, () => {
  console.log(`listening on *:${8080}`);
});
