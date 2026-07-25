import { useState } from "react";
import TextInput from "./text_input";
import Button from "./button";

interface CreateRoomProps {
  send: (mess: object) => void;
}

export default function UserRename({ send }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div>
      <span className="m-3">Your nickname</span>
      <TextInput
        value={roomName}
        onChange={setRoomName}
        placeholder="Your nickname..."
        className="m-3"
      />
      <Button
        className="m-3"
        label="Submit"
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
