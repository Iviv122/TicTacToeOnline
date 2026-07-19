import { t, TSchema } from "elysia";
import { StandardSchemaV1Like } from "elysia/dist/types";

export const models: Record<string, TSchema | StandardSchemaV1Like<unknown, unknown>> = {};
export function register_model(name: string, item: TSchema): void {
  models[name] = item;
}
