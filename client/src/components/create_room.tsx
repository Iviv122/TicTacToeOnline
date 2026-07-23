import { useState } from "react";

interface CreateRoomProps {
  send: (mess: object) => void;
}

export default function CreateRoom({ send }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="button"
        value="Submit"
        onClick={() =>
          send({
            command: "create",
            payload: {
              name: roomName,
            },
          })
        }
      />
    </div>
  );
}
