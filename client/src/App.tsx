import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const wsRef = useRef(null);
  const [roomCount, setRoomCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const mess = JSON.parse(event.data);
      if (mess.type === "rooms") {
        setRoomCount(mess.data.length);
      }
      if (mess.type === "users") {
        console.log(mess)
        setUsersCount(mess.data.length);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close(1000, "component unmounted");
    };
  }, []);

  const send = useCallback((data) => {
    wsRef.current?.send(JSON.stringify(data));
  }, []);

  return (
    <div>
      <div>Hi</div>
      <div>rooms count: {roomCount}</div>
      <div>users online: {usersCount}</div>
    </div>
  );
}

export default App;
