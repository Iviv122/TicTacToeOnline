import { useState } from "react";
import TextInput from "./text_input";
import Button from "./button";

interface CreateRoomProps {
  send: (mess: object) => void;
  className?: string
}

export default function UserRename({ send, className }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");

  return (
    <div className={`flex ${className}`}>
      <TextInput
        value={roomName}
        onChange={setRoomName}
        placeholder="Your nickname..."
        className="m-3"
      />
      <Button
        className="m-3"
        label="Change nickname"
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
