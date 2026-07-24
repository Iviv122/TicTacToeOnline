import { useCallback, useEffect, useRef, useState } from "react";
import CreateRoom from "./components/create_room";
import type { components } from "./schema";
import RoomCard from "./components/room_card";
import LobbyRoom from "./components/lobby_room";

function App() {
  const wsRef = useRef(null);
  const [roomCount, setRoomCount] = useState(0);
  const [rooms, setRooms] = useState<components["schemas"]["RoomSchema"][]>([]);
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
          prev.map((i) => (i.id === mess.data.room.id ? mess.data.room : i)),
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

  const a = rooms.find((i) => i.id === join);
  if (a) {
    return (
      <LobbyRoom
        room={a}
        leave={() => {
          const mes = {
            command: "leave",
            payload: {},
          };
          send(mes);
          setJoin("");
        }}
      />
    );
  }

  return (
    <div>
      <CreateRoom send={send} />
      <p>Your connection id: {userId}</p>
      <p>Your username: {userName}</p>
      <div>rooms count: {roomCount}</div>
      <div>users online: {usersCount}</div>
      {rooms.map((i) => (
        <RoomCard
          key={i.id}
          room={i}
          join={() => {
            const mes = {
              command: "join",
              payload: {
                room: i.id,
              },
            };
            setJoin(i.id);
            send(mes);
          }}
        />
      ))}
    </div>
  );
}

export default App;
