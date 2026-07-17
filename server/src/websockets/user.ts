import { Elysia, t } from "elysia";
import { roomManager } from "../classes/room_manager";
import { User } from "../types/user";

const clients = new Set<User>();

roomManager.addEventListener("onAdd", () => {
  for (const ws of clients) {
    ws.sendMessage(roomManager.get_rooms().toString());
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
      clients.add(user)
    },
    message(ws, message) {
      ws.send(message);

      console.log(ws);
    },
    close(ws, code, reason) {
      clients.delete(ws);
      console.log(code, reason);
    },
  });
