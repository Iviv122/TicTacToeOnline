import { t } from "elysia"
import { register_model } from "../models"

export const MessageSchema = t.Object({
  type: t.Union([
    t.Literal('connection'), // way to get id
    t.Literal('rooms'),
    t.Literal('users'),
    t.Literal('room'),
  ]),
  data: t.Any()
})
register_model("MessageSchema", MessageSchema)

export type Message = typeof MessageSchema.static
