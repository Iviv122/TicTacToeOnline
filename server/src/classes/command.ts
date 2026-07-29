import { t } from "elysia";
import { register_model } from "../models";
import { RolesSchema } from "./room";
import { TurnScheme } from "./game";

export const Command = t.Union([
  t.Literal("join"),
  t.Literal("rename"),
  t.Literal("create"),
  t.Literal("mark"),
  t.Literal("claim"),
  t.Literal("leave"),
  t.Literal("rematch"),
]);
register_model("Command", Command)

export const CommandPayload = t.Object({
  command: Command,
  payload: t.Object({
    name: t.Optional(t.String()),
    room: t.Optional(t.String()),
    target: t.Optional(t.String()),
    text: t.Optional(t.String()),
    role: t.Optional(RolesSchema),
    cords: t.Optional(TurnScheme)
  }),
});
register_model("CommandPayload", CommandPayload)

export type CommandPayloadType = typeof CommandPayload.static
