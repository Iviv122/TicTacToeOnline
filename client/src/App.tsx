import { useCallback, useEffect, useRef, useState } from "react";
import CreateRoom from "./components/create_room";
import type { components } from "./schema";
import LobbyRoom from "./components/lobby_room";
import UserRename from "./components/user_rename";
import RoomList from "./components/room_list";
import { toast } from "react-toastify";
import Msg from "./components/message";

function App() {
  const wsRef = useRef(null);
  const [roomCount, setRoomCount] = useState(0);
  const [rooms, setRooms] = useState<components["schemas"]["RoomSchema"][]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [join, setJoin] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [game, setGame] = useState<components["schemas"]["GameScheme"]>();

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
      if (mess.type === "game") {
        setGame(mess.data.game);
        if (mess.data.game) {
          if (mess.data.game.game_result) {
            if (mess.data.game.game_result === "Tie") {
              toast.info(Msg, {
                data: { title: `Game ended in tie!` },
                closeOnClick: true,
                autoClose: false,
              });
            } else {
              toast.info(Msg, {
                data: { title: `${mess.data.game.current_player.name} won!` },
                closeOnClick: true,
                autoClose: false,
              });
            }
          }
        }
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

  const reset = () => {
    setGame(undefined);
  };

  if (userId.trim() === "") {
    return <h1>Wait for connection id</h1>;
  }

  const a = rooms.find((i) => i.id === join);
  if (a) {
    return (
      <LobbyRoom
        my_name={userName}
        room={a}
        send={send}
        game={game}
        reset={reset}
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
      <div className="sm:flex justify-around">
        <CreateRoom className="text-xs sm:text-m2" send={send} />
        <UserRename className="text-xs sm:text-m2" send={send} />
      </div>
      <div className="flex justify-around mx-5 border-y">
        <p className="hidden sm:block">Your connection id: {userId}</p>
        <div>rooms count: {roomCount}</div>
        <div>users online: {usersCount}</div>
      </div>
      <p className="text-center text-2xl text-white">Rooms</p>
      <RoomList rooms={rooms} setJoin={setJoin} send={send} />
    </div>
  );
}

export default App;
