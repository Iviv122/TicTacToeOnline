import { useCallback, useState } from "react";
import CreateRoom from "./components/create_room";
import type { components } from "./schema";
import LobbyRoom from "./components/lobby_room";
import UserRename from "./components/user_rename";
import RoomList from "./components/room_list";
import { toast } from "react-toastify";
import Msg from "./components/message";
import useWebSocket from "./functions/useWebHook";
import type { Message } from "./types/message";

function App() {
  const [roomCount, setRoomCount] = useState(0);
  const [rooms, setRooms] = useState<components["schemas"]["RoomSchema"][]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [join, setJoin] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [game, setGame] = useState<components["schemas"]["GameScheme"]>();

  const handleMessage = useCallback(
    (message: components["schemas"]["MessageSchema"]) => {
      switch (message.type) {
        case "rename":
          if (message.data.new_name) {
            setUserName(message.data.new_name);
          }
          break;

        case "connection":
          if (message.data.connection_id) {
            setUserId(message.data.connection_id);
          }
          if (message.data.new_name) {
            setUserName(message.data.new_name);
          }
          break;

        case "rooms":
          if (message.data.rooms) {
            setRooms(message.data.rooms);
            setRoomCount(message.data.rooms.length);
          }
          break;

        case "users":
          if (message.data.users_count) {
            setUsersCount(message.data.users_count);
          }
          break;

        case "room": {
          const room = message.data.room;
          if (room) {
            setRooms((prev) => prev.map((i) => (i.id === room.id ? room : i)));
          }
          break;
        }

        case "join":
          if (message.data.room_id) {
            setJoin(message.data.room_id);
          }
          break;

        case "game": {
          const game = message.data.game
          if (game) {
            setGame(game);
            const result = game.game_result;
            if (result) {
              toast.info(Msg, {
                data: {
                  title:
                    result === "Tie"
                      ? "Game ended in tie!"
                      : `${game.current_player.name} won!`,
                },
                closeOnClick: true,
                autoClose: false,
              });
            }
          }

          break;
        }
      }
    },
    [],
  );

  const { send } = useWebSocket("ws://localhost:3000/ws", {
    onMessage: handleMessage,
  });

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
          } as Message;
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
