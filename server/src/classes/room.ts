import { t } from "elysia";
import { User, UserSchema } from "./user";
import { register_model } from "../models";

export class Room{
  id: String
  name: String
  users: Set<User>

  constructor(name : string,id: string) {
    this.id = id
    this.name = name
    this.users = new Set<User>()
  }
  join(user: User) {
    this.users.add(user)
  }
  user_count() : number {
    return this.users.size
  }
  toJSON() {
      return {
        id: this.id,
        name: this.name,
        users: [...this.users]
      };
    }

}

export const RoomSchema = t.Object({
  id: t.String(),
  name: t.String(),
  users: t.Array(UserSchema)
})
register_model("RoomSchema", RoomSchema)
