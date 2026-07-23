import Elysia, { status, t } from "elysia";
import { roomManager } from "../../classes/room_manager";
import { userManager } from "../../classes/user_manager";

const roomRouteSchema = t.Object({
  name: t.String({
    error: "Name is required",
    minLength: 1,
  }),
  owner_id: t.String({
      error: "Owner id is required",
      minLength: 1,
  })
})

export const roomRoute = new Elysia({ prefix: "/room" })
  .get("/", () => {
    return roomManager.get_rooms();
  })
