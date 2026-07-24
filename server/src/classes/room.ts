import { t } from "elysia";
import EventEmitter from "node:events";
import { User, UserSchema } from "./user";
import { register_model } from "../models";

export class Room extends EventEmitter {
  id: String;
  name: String;
  users: Set<User>;
  owner: User;

  constructor(name: string, id: string, owner: User) {
    super();
    this.id = id;
    this.name = name;
    this.users = new Set<User>();
    this.owner = owner;

    this.join(owner);
    // TODO: remove room on last user or owner leave
  }

  disband_room() {
    for (const i of this.users.values()) {
      i.leave();
    }
  }

  join(user: User) {
    console.log(this.users.size);
    if (this.users.has(user)) {
      return;
    }
    const room = this;
    this.users.add(user);
    user.once("close", (_user: User) => {
      if (!this.users.has(user)) {
        return;
      }
      this.users.delete(user);
      this.emit("update", room);
      console.log("user disconnected");
    });
    user.once("leave", (_user: User) => {
      if (!this.users.has(user)) {
        return;
      }
      this.users.delete(user);
      this.emit("update", room);
      console.log("user left");
    });

    this.emit("update", room);
  }

  player_turn() {}

  user_count(): number {
    return this.users.size;
  }
  toJSON() {
    return {
      id: this.id as string,
      owner: this.owner.toJSON(),
      name: this.name as string,
      users: [...this.users],
    };
  }
}

export const RoomSchema = t.Object({
  id: t.String(),
  owner: UserSchema,
  name: t.String(),
  users: t.Array(UserSchema),
});
register_model("RoomSchema", RoomSchema);
