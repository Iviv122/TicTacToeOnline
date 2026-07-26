import type { components } from "../schema";
import Button from "./button";
import SpecatatorCard from "./spectator_card";

interface RoomProps {
  room: components["schemas"]["RoomSchema"];
  leave: () => void;
  my_name: string;
  send: (data) => void;
}

export default function LobbyRoom({ room, leave, my_name, send}: RoomProps) {

  const claim = (role: components['schemas']['RolesSchema']): components['schemas']['CommandPayload'] => {
    console.log(role)
    return {
      command: 'claim',
      payload: {
        role: role
      }
    }
  }

  return (
    <div>
      <div className="flex gap-5">
        <h1 className="text-3xl">Room: {room.name}</h1>
        <Button label="leave" onClick={leave} />
      </div>
      <div className="text-center my-5">
        <p>players</p>
        <div className="flex">
          <div className="flex-1" onClick={() => send(claim('Cross'))}>
            <p>Cross</p>
            <p className="text-2xl">{room.crosses?.name || "Free place"}</p>
          </div>
          <div className="flex-1" onClick={() => send(claim('Circles'))}>
            <p>Circles</p>
            <p className="text-2xl">{room?.circles?.name || "Free place"}</p>
          </div>
        </div>
      </div>

      <div onClick={() => send(claim('Spectator'))}>
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
