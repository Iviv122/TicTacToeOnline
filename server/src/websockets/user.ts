import { Elysia } from "elysia";

export const websocket_instance = (route : string) => new Elysia()
.ws(route, {
  open(ws) {
    console.log(ws.id)
  },
  message(ws, message) {
    ws.send(message);
  },
  close(ws, code, reason) {
    console.log(code, reason);
  },
})
