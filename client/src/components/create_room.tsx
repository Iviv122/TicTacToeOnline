import { useState } from "react";
import TextInput from "./text_input";
import Button from "./button";

interface CreateRoomProps {
  send: (mess: object) => void;
  className?: string;
}

export default function CreateRoom({ send,className }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div className={`flex ${className}`}>
      <TextInput
        value={roomName}
        placeholder="Amazing room name"
        onChange={setRoomName}
        className="m-3"
      />
      <Button
        label="Create Room"
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
