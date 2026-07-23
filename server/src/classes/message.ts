import { t } from "elysia";
import { register_model } from "../models";
import { RoomSchema } from "./room";

export const MessageSchema = t.Object({
  type: t.Union([
    t.Literal("connection"), // way to get id
    t.Literal("join"), // force
    t.Literal("rooms"),
    t.Literal("users"),
    t.Literal("room"),
  ]),
  data: t.Object({
    connection_id: t.Optional(t.String()),
    room: t.Optional(RoomSchema),
    rooms: t.Optional(t.Array(RoomSchema)),
    room_id: t.Optional(t.String()),
    users_count: t.Optional(t.Number())
  }),
});
register_model("MessageSchema", MessageSchema);

export type Message = typeof MessageSchema.static;
