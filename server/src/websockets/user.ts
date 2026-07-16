import { Elysia } from "elysia";
import { roomManager } from "../classes/room_manager";

const clients = new Set<any>();

roomManager.addEventListener('onAdd', () => {
  for (const ws of clients) {
      ws.send(roomManager.get_rooms());
    }
})

export const websocket_instance = (route: string) =>
  new Elysia().ws(route, {
    open(ws) {
      clients.add(ws)
      ws.send(roomManager.get_rooms());
    },
    message(ws, message) {
      ws.send(message);
    },
    close(ws, code, reason) {
      clients.delete(ws)
      console.log(code, reason);
    },
    drain(ws) {
      ws.send("hi")
    }
  });
