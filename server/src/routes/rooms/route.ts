import Elysia, { t } from "elysia";
import { RoomManager } from "../../classes/room_manager";

export const room_route = new Elysia({ prefix: "/room" })
  .decorate("RoomManager", new RoomManager())
  .get("/", ({ RoomManager }) => {
    return RoomManager.get_rooms();
  })
  .post("add", ({ RoomManager, body: { name } }) => {
    const room = RoomManager.add_room(name)
    return room
  }, {
    body: t.Object({
      name: t.String({
        error: "Name is required",
        minLength : 1,
      }),
    }),
  });
