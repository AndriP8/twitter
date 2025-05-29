import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./colums.helpers";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
});

const userInsertSchema = createInsertSchema(usersTable);
const userSelectSchema = createSelectSchema(usersTable);
const userLoginSchema = userInsertSchema.pick({
  email: true,
  password: true,
});

export const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  author_id: uuid().references(() => usersTable.id),
  content: varchar({ length: 255 }).notNull(),
  image_src: varchar({ length: 255 }),
  ...timestamps,
});

const postInsertSchema = createInsertSchema(postsTable);
const postSelectSchema = createSelectSchema(postsTable);

export {
  userInsertSchema,
  userLoginSchema,
  userSelectSchema,
  postInsertSchema,
  postSelectSchema,
};
