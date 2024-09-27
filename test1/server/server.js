import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";

const app = express(); // express 초기화
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*", // 모든 출처에서의 연결 허용
});

const UserMap = new Map();
let like = 0;
io.on("connection", (sorket) => {
  console.log(sorket.id + "들어왔슈");
  sorket.emit("update", like);
  sorket.on("clicked", () => {
    like++;
    io.emit("update", like);
  });

  sorket.on("disconnect", () => {
    UserMap.delete(sorket.id);
    console.log(sorket.id + "나갔슈");
  });
});

server.listen(8080, () => {
  console.log(`listening on *:${8080}`);
});
