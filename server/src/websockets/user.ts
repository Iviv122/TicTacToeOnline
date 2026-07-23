import { Elysia} from "elysia";
import { User } from "../classes/user";
import { CommandPayload } from "../classes/command";
import { userManager } from "../classes/user_manager";


export const websocket_instance = (route: string) =>
  new Elysia().ws(route, {
    body: CommandPayload,
    open(ws) {
      const user = new User(ws.id, `User_${ws.id.slice(0, 4)}`, ws.raw);
      userManager.join(user)
    },
    message(ws, message) {
      userManager.message(message,ws.id)
    },
    close(ws, code, reason) {
      userManager.close(ws.id, code, reason)
    },
  });
