import { createGetDb } from "@agent-native/core/db";
import * as schema from "../drizzle/schema.ts";

export const getDb = createGetDb(schema);
export { schema };
