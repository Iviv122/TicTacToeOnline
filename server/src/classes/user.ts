import { ServerWebSocket } from "bun";
import { t, TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";
import { register_model } from "../models";


interface WS{
  id?: string | undefined;
  validator?: TypeCheck<TSchema> | undefined;
}

export class User extends EventTarget {
  constructor(
    public id: string,
    public name: string,
    public ws: ServerWebSocket<WS>,
  ) {
    super()
  }

  private _onClose: Event = new Event('onClose');
  close(): void{
    this.dispatchEvent(this._onClose)
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
