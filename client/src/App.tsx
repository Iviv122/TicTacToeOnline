import { useCallback, useEffect, useRef, useState } from "react";
import CreateRoom from "./components/create_room";

function App() {
  const wsRef = useRef(null);
  const [roomCount, setRoomCount] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [join, setJoin] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const mess = JSON.parse(event.data);
      if (mess.type === "rooms") {
        setRoomCount(mess.data.length);
        setRooms(mess.data);
      }
      if (mess.type === "users") {
        setUsersCount(mess.data.length);
      }
      if (mess.type === "room") {
        setRooms((prev) =>
          prev.map((i) => (i.id === mess.data.id ? mess.data : i)),
        );
      }
      console.log(mess);
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
      <CreateRoom />
      <div>Hi</div>
      <div>rooms count: {roomCount}</div>
      <div>users online: {usersCount}</div>
      <div>
        {rooms.map((i) => (
          <div key={i.id}>
            <h3>{i.name}</h3>
            <p>users: {i.users.length}</p>
            <button
              onClick={() => {
                const mes = {
                  command: "join",
                  payload: {
                    room: i.id,
                  },
                };
                setJoin(i.id);
                send(mes);
              }}
            >
              join
            </button>
            {i.id === join ? (
              <button
                onClick={() => {
                  const mes = {
                    command: "leave",
                  };
                  send(mes);
                  setJoin("");
                }}
              >
                leave
              </button>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
