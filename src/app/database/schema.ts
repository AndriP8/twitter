import { integer, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./colums.helpers";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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
  author_id: uuid()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  content: varchar({ length: 255 }).notNull(),
  image_src: varchar({ length: 255 }),
  likes_count: integer().default(0).notNull(),
  ...timestamps,
});
const postInsertSchema = createInsertSchema(postsTable);
const postSelectSchema = createSelectSchema(postsTable);

export const likesTable = pgTable(
  "likes",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    post_id: uuid()
      .references(() => postsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    ...timestamps,
  },
  (t) => [unique("unique_post_like").on(t.user_id, t.post_id)],
);
const likeInsertSchema = createInsertSchema(likesTable);
const likeSelectSchema = createSelectSchema(likesTable);
const likeUpdateSchema = createUpdateSchema(likesTable);

export {
  userInsertSchema,
  userLoginSchema,
  userSelectSchema,
  postInsertSchema,
  postSelectSchema,
  likeInsertSchema,
  likeSelectSchema,
  likeUpdateSchema,
};
