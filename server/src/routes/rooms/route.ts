import Elysia, { t } from "elysia";
import { roomManager } from "../../classes/room_manager";



export const room_route = new Elysia({ prefix: "/room" })
  .get("/", () => {
    return roomManager.get_rooms();
  })
  .post("add", ({ body: { name } }) => {
    const room = roomManager.add_room(name)
    return room
  }, {
    body: t.Object({
      name: t.String({
        error: "Name is required",
        minLength : 1,
      }),
    }),
  });
