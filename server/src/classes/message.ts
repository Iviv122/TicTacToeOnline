import { t } from "elysia";
import { register_model } from "../models";
import { RolesSchema, RoomSchema } from "./room";
import { GameScheme } from "./game";

export const MessageSchema = t.Object({
  type: t.Union([
    t.Literal("connection"), // way to get id
    t.Literal("game"),
    t.Literal("rename"),
    t.Literal("join"), // force
    t.Literal("rooms"),
    t.Literal("users"),
    t.Literal("room"),
  ]),
  data: t.Object({
    new_name: t.Optional(t.String()),
    connection_id: t.Optional(t.String()),
    room: t.Optional(RoomSchema),
    rooms: t.Optional(t.Array(RoomSchema)),
    room_id: t.Optional(t.String()),
    users_count: t.Optional(t.Number()),
    role: t.Optional(RolesSchema),
    game: t.Optional(GameScheme)
  }),
});
register_model("MessageSchema", MessageSchema);

export type Message = typeof MessageSchema.static;
