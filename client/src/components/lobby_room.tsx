import type { components } from "../schema"

interface RoomProps{
  room: components['schemas']['RoomSchema']
  leave: () => void;
}

export default function LobbyRoom({ room,leave } : RoomProps) {
  return (
    <div>
      <h1>Room : {room.name}</h1>
      <button onClick={leave}>leave</button>
      <ul>
        {
          room.users.map(i => <li key={i.id}>{i.name}</li>)
        }
      </ul>
    </div>
  )
}
