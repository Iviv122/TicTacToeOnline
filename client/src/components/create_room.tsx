import { useState } from "react";
import { $api } from "../api/client";

export default function CreateRoom() {
  const [name, setName] = useState("");

  const { mutate } = $api.useMutation('post', '/api/room/add')


  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="button"
        value="Submit"
        onClick={
        () => mutate(
          {
            body: {
              name: name
            }
          }
        )
      }/>
    </div>
  );
}
