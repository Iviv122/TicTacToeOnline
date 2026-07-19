import Elysia, { t } from "elysia";
import { roomManager } from "../../classes/room_manager";

const roomRouteSchema = t.Object({
  name: t.String({
    error: "Name is required",
    minLength: 1,
  })
})

export const roomRoute = new Elysia({ prefix: "/room" })
  .get("/", () => {
    return roomManager.get_rooms();
  })
  .post("add", ({ body: { name } }) => {
    const room = roomManager.create_room(name)
    return room
  }, {
    body: roomRouteSchema
  });
