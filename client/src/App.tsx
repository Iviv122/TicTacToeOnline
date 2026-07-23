import { useCallback, useEffect, useRef, useState } from "react";
import CreateRoom from "./components/create_room";
import type { components } from "./schema";

function App() {
  const wsRef = useRef(null);
  const [roomCount, setRoomCount] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [join, setJoin] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const mess = JSON.parse(
        event.data,
      ) as components["schemas"]["MessageSchema"];

      if (mess.type === "rename") {
        setUserName(mess.data.new_name);
      }
      if (mess.type === "connection") {
        setUserId(mess.data.connection_id);
        setUserName(mess.data.new_name);
      }
      if (mess.type === "rooms") {
        setRoomCount(mess.data.rooms.length);
        setRooms(mess.data.rooms);
      }
      if (mess.type === "users") {
        setUsersCount(mess.data.users_count);
      }
      if (mess.type === "room") {
        setRooms((prev) =>
          prev.map((i) => (i.id === mess.data.room.id ? mess.data : i)),
        );
      }
      if (mess.type === "join") {
        setJoin(mess.data.room_id);
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

  if (userId.trim() === "") {
    return <h1>Wait for connection id</h1>;
  }

  return (
    <div>
      <CreateRoom send={send} />
      <p>Your connection id: {userId}</p>
      <p>Your username: {userName}</p>
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
                    payload: {},
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
