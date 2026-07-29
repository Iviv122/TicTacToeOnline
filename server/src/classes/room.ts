import { t } from "elysia";
import EventEmitter from "node:events";
import { User, UserSchema } from "./user";
import { register_model } from "../models";
import { GameScheme, GameSchemeType, TicTacToeGame } from "./game";
import { userManager } from "./user_manager";
import { Message } from "./message";

export class Room extends EventEmitter {
  id: String;
  name: String;
  users: Set<User>;
  owner: User;

  crosses?: User = undefined;
  circles?: User = undefined;

  game?: TicTacToeGame<User> = undefined;
  state: RoomState = "Waiting";

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

  update = () => {
    this.emit("update", this);
  };

  cleaunup = (user: User) => {
    if (!this.users.has(user)) return;

    this.users.delete(user);

    user.off("claim", this.claim_role);

    if (this.crosses === user) {
      this.crosses = undefined;
    }
    if (this.circles === user) {
      this.circles = undefined;
    }

    if (this.owner === user) {
      const new_owner = this.users.values().next().value;
      if (new_owner) {
        this.owner = new_owner;
      } else {
        this.disband_room();
      }
    }

    this.update();
  };

  join(user: User) {
    if (this.users.has(user)) {
      return;
    }
    this.users.add(user);
    user.once("close", this.cleaunup);
    user.once("leave", this.cleaunup);

    user.on("claim", this.claim_role);

    this.update();
  }

  player_turn() {}

  claim_role = (user: User, role: RoomRole) => {
    switch (role) {
      case "Circles":
        this.claim_circles(user);
        this.startGame();
        return;
      case "Cross":
        this.claim_crosses(user);
        this.startGame();
        return;
      case "Spectator":
        this.claim_spectator(user);
        return;
      default:
        return;
    }
  };

  claim_spectator(user: User) {
    if (this.circles === user) {
      this.circles = undefined;
    }
    if (this.crosses === user) {
      this.crosses = undefined;
    }
    this.update();
  }
  claim_crosses(user: User) {
    if (this.crosses !== undefined) {
      return;
    }
    this.crosses = user;
    this.update();
  }
  claim_circles(user: User) {
    if (this.circles !== undefined) {
      return;
    }
    this.circles = user;
    this.update();
  }

  user_count(): number {
    return this.users.size;
  }

  startGame(): void {
    if (this.crosses && this.circles) {
      this.game = new TicTacToeGame(this.crosses, this.circles);
      this.state = "Playing";
      this.update();
      this.sendGameToAll()
    }
  }
  endGame(): void {
    this.state = "Waiting";
    this.update();
  }

  getGame(): GameSchemeType | undefined {
    return this.game?.toJson();
  }

  sendGameToAll() {
    for (const i of this.users.values()) {
      this.sendGame(i);
    }
  }

  sendGame(user: User) {
    const game = this.getGame();
    if (game === undefined) {
      return;
    }
    const mess = {
      type: "game",
      data: {
        game: game
      }
    } as Message;
    user.sendMessage(mess);
  }

  toJSON() {
    return {
      id: this.id as string,
      owner: this.owner.toJSON(),
      name: this.name as string,
      crosses: this.crosses?.toJSON(),
      circles: this.circles?.toJSON(),
      users: [...this.users],
      state: this.state as string,
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

export const RoomState = t.Union([t.Literal("Waiting"), t.Literal("Playing")]);
register_model("RoomState", RoomState);
export type RoomState = typeof RoomState.static;

export const RoomSchema = t.Object({
  id: t.String(),
  owner: UserSchema,
  name: t.String(),
  users: t.Array(UserSchema),
  crosses: t.Optional(UserSchema),
  circles: t.Optional(UserSchema),
  state: RoomState,
});
register_model("RoomSchema", RoomSchema);
