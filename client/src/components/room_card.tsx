import type { components } from "../schema";
import Button from "./button";

interface RoomCardProps {
  room: components["schemas"]["RoomSchema"];
  join: () => void;
  className?: string;
}

export default function RoomCard({ room, join, className }: RoomCardProps) {
  return (
    <div
      className={`flex justify-around items-center  mx-10 py-5 px-15 ${className}`}
    >
      <p>{room.name}</p>
      <p className="ml-6">players: {room.users?.length}</p>
      <p className="ml-6 hidden sm:block">id: {room.id}</p>

      <Button onClick={join} label="Join" />
    </div>
  );
}
