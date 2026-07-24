import type { components } from "../schema";

interface RoomProps {
  room: components["schemas"]["RoomSchema"];
  leave: () => void;
}

export default function LobbyRoom({ room, leave }: RoomProps) {
  return (
    <div>
      <h1>Room: {room.name}</h1>
      <button onClick={leave}>leave</button>

      <p>players</p>
      <div className="flex">
        <div>
          <p>Cross</p>
        </div>
        <div>
          <p>Circles</p>
        </div>
      </div>

      <p>spectators</p>
      <ul>
        {room.users.map((i) => (
          <li key={i.id}>
            {i.name}
            {"   "}
            {i.id === room.owner.id ? (
              <i>
                <b>owner</b>
              </i>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
