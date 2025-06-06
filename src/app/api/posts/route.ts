import { db } from "@/app/database/client";
import {
  likesTable,
  postInsertSchema,
  postsTable,
  usersTable,
} from "@/app/database/schema";
import { asc, eq, gt, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { content, image_src, author_id } = (await req.json()) as z.infer<
      typeof postInsertSchema
    >;

    if (!author_id || !content) {
      return Response.json(
        { error: "Author or content are required" },
        { status: 400 },
      );
    }

    const insertedPost = await db
      .insert(postsTable)
      .values({
        content,
        image_src: image_src || null,
        author_id,
      })
      .returning()
      .execute();

    return Response.json({ data: insertedPost[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const size = Number(searchParams.get("size")) || 10;
    const requestedUserId = searchParams.get("user_id") || undefined;

    const posts = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        image_src: postsTable.image_src,
        created_at: postsTable.created_at,
        updated_at: postsTable.updated_at,
        author: {
          id: postsTable.author_id,
          name: usersTable.name,
        },
        stats: {
          like_count:
            sql<number>`CAST((SELECT count(*) FROM ${likesTable} WHERE ${likesTable.post_id} = ${postsTable.id}) AS INTEGER)`.as(
              "like_count",
            ),
        },
        user_interaction: {
          liked: sql<boolean>`EXISTS (
            SELECT 1 FROM ${likesTable}
            WHERE ${likesTable.post_id} = ${postsTable.id}
            ${
              requestedUserId
                ? sql`AND ${likesTable.user_id} = ${requestedUserId}`
                : sql``
            }
          )`.as("liked"),
        },
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.author_id, usersTable.id))
      .where(cursor ? gt(postsTable.id, cursor) : undefined)
      .limit(size)
      .orderBy(asc(postsTable.id));

    const nextCursor = posts[posts.length - 1]?.id;

    return Response.json(
      {
        data: posts,
        pagination: {
          cursor: nextCursor,
          has_more: posts.length === size,
          size: posts.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
