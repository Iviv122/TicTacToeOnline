import { useState } from "react";

interface CreateRoomProps {
  send: (mess: object) => void;
}

export default function UserRename({ send }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div>
      <span>rename</span>
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
            command: "rename",
            payload: {
              name: roomName,
            },
          })
        }
      />
    </div>
  );
}
