import { t } from "elysia";

export const Command = t.Union([
  t.Literal("join"),
  t.Literal("mark"),
  t.Literal("leave"),
  t.Literal("rematch"),
]);


export const CommandPayload = t.Object({
  command: Command,
  payload: t.Object({
    room: t.Optional(t.String()),
    target: t.Optional(t.String()),
    text: t.Optional(t.String()),
  }),
});
