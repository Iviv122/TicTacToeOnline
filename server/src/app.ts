import openapi, { fromTypes } from "@elysia/openapi";
import Elysia from "elysia";
import { websocket_instance } from "./websockets/user";
import cors from "@elysia/cors";
import { roomRoute } from "./routes/rooms/route";
import { models } from "./models";

export const app = new Elysia()
  .model(models)
  .use(
    openapi({
      references: fromTypes(
        process.env.NODE_ENV === "production"
          ? "dist/index.d.ts"
          : "src/index.ts",
      ),
    }),
  )
  .use(cors())
  .use(websocket_instance("/ws"))
  .group("/api", (app) => app.use(roomRoute))
  .listen(3000);
