const express = require("express");
const { Server } = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const http = require("http");

const app = express(); // express 초기화

const server = http.createServer(app);

// 환경 변수에서 값을 가져오거나 null일 경우 8080으로 설정
const port = process.env.PORT || 8080;

// http 서버를 웹소켓 서버로 업그레이드
const io = new Server(server, {
  cors: "*", // 모든 출처에서의 연결 허용
});

const rooms = new Map();

// io.connection
io.on("connection", (socket) => {
  // socket은 방금 연결된 클라이언트 소켓을 나타냅니다.
  // 각 소켓에는 ID가 할당됩니다.
  console.log(socket.id, "connected");

  socket.on("username", (username) => {
    console.log("username:", username);
    socket.data.username = username;
  });

  socket.on("createRoom", async (callback) => {
    // callback은 클라이언트에서 전달된 콜백 함수
    const roomId = uuidV4(); // <- 1 새로운 uuid 생성
    await socket.join(roomId); // <- 2 생성한 사용자가 방에 참여

    // roomId를 키로 하고 플레이어를 포함한 roomData를 값으로 설정
    rooms.set(roomId, {
      // <- 3
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }],
    });
    // Map(1){'2b5b51a9-707b-42d6-9da8-dc19f863c0d0' => [{id: 'socketid', username: 'username1'}]}

    callback(roomId); // <- 4 클라이언트에 roomId를 응답하기 위해 콜백 함수 호출
  });

  socket.on("joinRoom", async (args, callback) => {
    // 방이 존재하고 플레이어가 대기 중인지 확인
    const room = rooms.get(args.roomId);
    let error, message;

    if (!room) {
      // 방이 존재하지 않는 경우
      error = true;
      message = "방이 존재하지 않습니다";
    } else if (room.length <= 0) {
      // 방이 비어있는 경우 적절한 메시지 설정
      error = true;
      message = "방이 비어 있습니다";
    } else if (room.length >= 2) {
      // 방이 가득 찬 경우
      error = true;
      message = "방이 가득 찼습니다"; // 메시지를 '방이 가득 찼습니다'로 설정
    }

    if (error) {
      // 오류가 있는 경우, 클라이언트가 콜백을 전달했는지 확인하고,
      // 콜백이 존재하면 오류 객체와 함께 콜백을 호출하고 종료하거나
      // 콜백이 없으면 그냥 종료

      if (callback) {
        // 사용자가 콜백을 전달한 경우, 오류 페이로드와 함께 호출
        callback({
          error,
          message,
        });
      }

      return; // 종료
    }

    await socket.join(args.roomId); // 참여하는 클라이언트를 방에 참여시킴

    // 참여하는 사용자의 데이터를 방의 플레이어 목록에 추가
    const roomUpdate = {
      ...room,
      players: [
        ...room.players,
        { id: socket.id, username: socket.data?.username },
      ],
    };

    rooms.set(args.roomId, roomUpdate);

    callback(roomUpdate); // 클라이언트에 방 세부정보를 응답

    // 방에 'opponentJoined' 이벤트를 방출하여 다른 플레이어에게 상대가 참여했음을 알림
    socket.to(args.roomId).emit("opponentJoined", roomUpdate);
  });

  socket.on("move", (data) => {
    // 방에 있는 모든 소켓에 방출하되, 방출한 소켓은 제외
    socket.to(data.room).emit("move", data.move);
  });

  socket.on("disconnect", () => {
    const gameRooms = Array.from(rooms.values()); // <- 1

    gameRooms.forEach((room) => {
      // <- 2
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

      if (userInRoom) {
        if (room.players.length < 2) {
          // 방에 플레이어가 1명만 있는 경우, 방을 닫고 종료
          rooms.delete(room.roomId);
          return;
        }

        socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
      }
    });
  });

  socket.on("closeRoom", async (data) => {
    socket.to(data.roomId).emit("closeRoom", data); // <- 1 방이 닫힌다는 것을 방의 다른 사용자에게 알림

    const clientSockets = await io.in(data.roomId).fetchSockets(); // <- 2 방의 모든 소켓 가져오기

    // 각 소켓 클라이언트를 반복
    clientSockets.forEach((s) => {
      s.leave(data.roomId); // <- 3 소켓.io에서 방을 떠나게 함
    });

    rooms.delete(data.roomId); // <- 4 방을 rooms 맵에서 삭제
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
