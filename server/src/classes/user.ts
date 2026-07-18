import { TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";
import { ServerWebSocket } from "elysia/dist/ws/bun";

interface WS{

  id?: string | undefined;
  validator?: TypeCheck<TSchema> | undefined;
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public ws: ServerWebSocket<WS>,
  ) { }

  sendMessage(mess : Message): void {
    this.ws.send(JSON.stringify(mess))
  }
}

export interface Message{
  type: "rooms" // list of rooms
      | "users",// list of users
  data: any,
}
