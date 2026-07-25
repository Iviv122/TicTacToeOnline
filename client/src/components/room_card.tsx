import type { components } from "../schema";
import Button from "./button";

interface RoomCardProps {
  room: components["schemas"]["RoomSchema"];
  join: () => void;
  className?: string
}

export default function RoomCard({ room, join,className }: RoomCardProps) {
  return (
    <div className={`flex items-center mx-10 py-5 px-15 ${className}`}>
          <p>{room.name}</p>
          <p className="ml-6">player-count: {room.users?.length}</p>
          <p className="ml-6">room-id: {room.id}</p>

          <div className="ml-auto">
            <Button onClick={join} label="Join" />
          </div>
        </div>
  );
}
