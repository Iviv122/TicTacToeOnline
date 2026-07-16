import openapi from "@elysia/openapi";
import Elysia from "elysia";
import { user_websocket } from "./websockets/user";
import cors from "@elysia/cors";

export const app = new Elysia()
  .use(openapi())
  .use(cors())
  .use(user_websocket("/ws"))
  .group("/api", (app) =>
    app.get("/", () => "hello").post("/hello", () => "OpenAPI"),
  )
  .listen(3000);
