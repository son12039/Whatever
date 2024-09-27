import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://localhost:8080");

function App() {
  const [like, setLike] = useState(0);
  const [fanclub, setBool] = useState(0);
  const change = () => {
    socket.emit("clicked", like);
  };
  const a = 0;
  useEffect(() => {
    socket.on("update", (l) => {
      setLike(l);
      if (l >= 100) {
        setBool(1);
      }
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      socket.off("update");
    };
  }, []);

  return (
    <>
      {[...Array(3)].map((_, i) => (
        <h1>1</h1>
      ))}
    </>
  );
}
export default App;
