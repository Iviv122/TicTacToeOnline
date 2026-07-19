import { t } from "elysia";
import { register_model } from "../models";

export const Command = t.Union([
  t.Literal("join"),
  t.Literal("mark"),
  t.Literal("leave"),
  t.Literal("rematch"),
]);
register_model("Command", Command)

export const CommandPayload = t.Object({
  command: Command,
  payload: t.Object({
    room: t.Optional(t.String()),
    target: t.Optional(t.String()),
    text: t.Optional(t.String()),
  }),
});
register_model("CommandPayload", CommandPayload)

export type CommandPayloadType = typeof CommandPayload.static
