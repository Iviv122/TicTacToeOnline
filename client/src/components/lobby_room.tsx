import type { components } from "../schema";
import Button from "./button";
import SpecatatorCard from "./spectator_card";

interface RoomProps {
  room: components["schemas"]["RoomSchema"];
  leave: () => void;
  my_name: string;
}

export default function LobbyRoom({ room, leave, my_name }: RoomProps) {
  return (
    <div>
      <div className="flex gap-5">
        <h1 className="text-3xl">Room: {room.name}</h1>
        <Button label="leave" onClick={leave} />
      </div>
      <div className="text-center my-5">
        <p>players</p>
        <div className="flex">
          <div className="flex-1">
            <p>Cross</p>
            <p className="text-2xl">Player2</p>
          </div>
          <div className="flex-1">
            <p>Circles</p>
            <p className="text-2xl">Player2</p>
          </div>
        </div>
      </div>

      <div>
        <p>spectators</p>
        <ul>
          {room.users.map((i) => (
            <SpecatatorCard
              user={i}
              is_owner={i.id === room.owner.id}
              is_user={i.name === my_name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
