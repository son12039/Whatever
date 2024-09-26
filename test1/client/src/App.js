import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

function App() {
  const [userId, setUserId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [bool, check] = useState(false);
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      setUserId(socket.id);
    });

    socket.on("allUsers", (users) => {
      setConnectedUsers(users); // 모든 사용자 목록 업데이트
    });

    return () => {
      socket.off("connect");
      socket.off("allUsers");
    };
  }, []);
  const nick = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (nickname) {
      setNickname(nickname);
      check(true);
      socket.emit("username", nickname);
      setNickname("");
    }
  };
  return (
    <div>
      {bool ? (
        <>
          <p>내 닉네임: {userId}</p>
          <h2>접속한 사용자:</h2>
          <ul>
            {connectedUsers.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>닉네임입력해!!</h1>
          <form onSubmit={nick}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
            />
            <button type="submit">입력</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
