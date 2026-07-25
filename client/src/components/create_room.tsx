import { useState } from "react";
import TextInput from "./text_input";
import Button from "./button";

interface CreateRoomProps {
  send: (mess: object) => void;
}

export default function CreateRoom({ send }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div>
      <span className="m-3">Create room</span>
      <TextInput
        value={roomName}
        placeholder="Amazing room"
        onChange={setRoomName}
        className="m-3"
      />
      <Button
        label="Submit"
        onClick={() =>
          send({
            command: "create",
            payload: {
              name: roomName,
            },
          })
        }
        className="m-3"
      />
    </div>
  );
}
