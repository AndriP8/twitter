import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./colums.helpers";
import { createSelectSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
});

const userInsertSchema = createSelectSchema(usersTable);

export const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  authorId: uuid().references(() => usersTable.id),
  content: varchar({ length: 255 }).notNull(),
  imageSrc: varchar({ length: 255 }),
  ...timestamps,
});

const postInsertSchema = createSelectSchema(postsTable);
const postSelectSchema = createSelectSchema(postsTable);

export { userInsertSchema, postInsertSchema, postSelectSchema };
