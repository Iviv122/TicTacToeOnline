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

  sendMessage(mess : string | BufferSource) {
    this.ws.send(JSON.stringify(mess))
  }
}
