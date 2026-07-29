import { ServerWebSocket } from "bun";
import { t, TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";
import { register_model } from "../models";
import { EventEmitter } from "node:events";
import { Message } from "./message";
import { RoomRole } from "./room";


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

  claim(role : RoomRole): void{
    this.emit("claim",this,role)
  }

  // make turn
  mark(x:number,y:number): void {
    this.emit("mark", this,x,y)
  }

  // use when socket is closed
  close(): void{
    this.emit("close", this)
  }

  // leave from game/room
  leave(): void{
    this.emit("leave", this)
  }

  rename(new_name: string): void{
    this.name = new_name
    this.emit("update",this)
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
export type UserSchemaType = typeof UserSchema.static
register_model("UserSchema", UserSchema)
