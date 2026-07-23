import { ServerWebSocket } from "bun";
import { t, TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";
import { register_model } from "../models";
import { EventEmitter } from "node:events";
import { Message } from "./message";


interface WS{
  id?: string | undefined;
  validator?: TypeCheck<TSchema> | undefined;
}

export class User extends EventEmitter {
  constructor(
    public id: string,
    public name: string,
    public ws: ServerWebSocket<WS>,
  ) {
    super()
  }

  // make turn
  mark(): void {

  }

  // use when socket is closed
  close(): void{
    this.emit("close", this)
  }

  // leave from game/room
  leave(): void{
    this.emit("leave", this)
  }

  sendMessage(mess : Message): void {
    this.ws.send(JSON.stringify(mess))
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export const UserSchema = t.Object({
  id: t.String(),
  name: t.String()
})
register_model("UserSchema", UserSchema)
