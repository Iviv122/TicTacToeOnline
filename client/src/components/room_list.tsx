import type { components } from "../schema";
import RoomCard from "./room_card";

interface RoomListProps {
  rooms: components["schemas"]["RoomSchema"][];
  setJoin: (value: string) => void
  send: (value) => void
}

export default function RoomList({rooms,setJoin,send} : RoomListProps) {
  return (
    <div>
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
