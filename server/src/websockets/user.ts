import { Elysia, t } from "elysia";
import { roomManager } from "../classes/room_manager";
import { User } from "../types/user";

const clients = new Map<string,User>()

roomManager.addEventListener("onAdd", () => {
  for (const client of clients) {
    client[1].sendMessage(roomManager.get_rooms().toString());
  }
});

const Command = t.Union([
  t.Literal("join"),
  t.Literal("mark"),
  t.Literal("leave"),
  t.Literal("rematch"),
]);
const CommandPayload = t.Object({
  command: Command,
  payload: t.Object({
    room: t.Optional(t.String()),
    target: t.Optional(t.String()),
    text: t.Optional(t.String()),
  }),
});

export const websocket_instance = (route: string) =>
  new Elysia().ws(route, {
    body: CommandPayload,
    open(ws) {
      ws.send(roomManager.get_rooms());
      const user = new User(ws.id, `User_${ws.id.slice(0, 4)}`, ws.raw);
      clients.set(ws.id,user)
    },
    message(ws, message) {
      ws.send(message);
    },
    close(ws, code, reason) {
      clients.delete(ws.id)
      console.log(code, reason);
    },
  });
