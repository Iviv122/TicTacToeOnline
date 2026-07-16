import openapi from "@elysia/openapi";
import Elysia from "elysia";
import { websocket_instance } from "./websockets/user";
import cors from "@elysia/cors";
import { room_route } from "./routes/rooms/route";


export const app = new Elysia()
  .use(openapi())
  .use(cors())
  .use(websocket_instance("/ws"))
  .group('/api', (app) =>
    app
      .use(room_route)
  )
  .listen(3000);
