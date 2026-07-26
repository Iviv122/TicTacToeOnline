import { t } from "elysia";
import EventEmitter from "node:events";
import { User, UserSchema } from "./user";
import { register_model } from "../models";

export class Room extends EventEmitter {
  id: String;
  name: String;
  users: Set<User>;
  owner: User;

  crosses?: User = undefined;
  circles?: User = undefined;

  constructor(name: string, id: string, owner: User) {
    super();
    this.id = id;
    this.name = name;
    this.users = new Set<User>();
    this.owner = owner;

    this.join(owner);
    this.addListener("update", () => {
      console.log(this.users.size);
      if (this.users.size === 0) {
        this.disband_room();
      }
    });
  }

  disband_room() {
    for (const i of this.users.values()) {
      i.leave();
    }
    this.destroy();
  }

  destroy() {
    this.users.clear();
    this.emit("end", this);
  }

  cleaunup = (user: User) => {
    if (!this.users.has(user)) return;

    this.users.delete(user);

    user.off("claim", this.claim_role);

    if (this.crosses === user) this.crosses = undefined;
    if (this.circles === user) this.circles = undefined;

    this.emit("update", this);
  };

  join(user: User) {
    if (this.users.has(user)) {
      return;
    }
    const room = this;
    this.users.add(user);
    user.once("close", this.cleaunup);
    user.once("leave", this.cleaunup);

    user.on("claim", this.claim_role);

    this.emit("update", room);
  }

  player_turn() {}

  claim_role = (user: User, role: RoomRole) => {
    switch (role) {
      case "Circles":
        this.claim_circles(user);
        return;
      case "Cross":
        this.claim_crosses(user);
        return;
      case "Spectator":
        this.claim_spectator(user);
        return;
      default:
        return;
    }
  }

  claim_spectator(user: User) {
    if (this.circles === user) {
      this.circles = undefined;
    }
    if (this.crosses === user) {
      this.crosses = undefined;
    }
    this.emit("update", this);
  }
  claim_crosses(user: User) {
    if (this.crosses !== undefined) {
      return;
    }
    this.crosses = user;
    this.emit("update", this);
  }
  claim_circles(user: User) {
    if (this.circles !== undefined) {
      return;
    }
    this.circles = user;
    this.emit("update", this);
  }

  user_count(): number {
    return this.users.size;
  }
  toJSON() {
    return {
      id: this.id as string,
      owner: this.owner.toJSON(),
      name: this.name as string,
      crosses: this.crosses?.toJSON(),
      circles: this.circles?.toJSON(),
      users: [...this.users],
    };
  }
}

export const RolesSchema = t.Union([
  t.Literal("Cross"),
  t.Literal("Circles"),
  t.Literal("Spectator"),
]);
register_model("RolesSchema", RolesSchema);
export type RoomRole = typeof RolesSchema.static;

export const RoomSchema = t.Object({
  id: t.String(),
  owner: UserSchema,
  name: t.String(),
  users: t.Array(UserSchema),
  crosses: t.Optional(UserSchema),
  circles: t.Optional(UserSchema),
});

register_model("RoomSchema", RoomSchema);
