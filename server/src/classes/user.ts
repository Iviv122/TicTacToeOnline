import { ServerWebSocket } from "bun";
import { t, TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";
import { register_model } from "../models";
import { EventEmitter } from "node:events";


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

  close(): void{
    this.emit("close", this)
    this.removeAllListeners()
  }

  sendMessage(mess : Message): void {
    this.ws.send(JSON.stringify(mess))
  }
}

export const UserSchema = t.Object({
  id: t.String(),
  name: t.String()
})
register_model("UserSchema", UserSchema)

export const MessageSchema = t.Object({
  type: t.Union([
    t.Literal('rooms'),
    t.Literal('users'),
    t.Literal('room')
  ]),
  data: t.Any()
})
register_model("MessageSchema", MessageSchema)

export type Message = typeof MessageSchema.static
