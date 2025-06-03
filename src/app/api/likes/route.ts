import { db } from "@/app/database/client";
import { likeInsertSchema, likesTable } from "@/app/database/schema";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { post_id, user_id } = (await req.json()) as z.infer<
      typeof likeInsertSchema
    >;

    if (!post_id || !user_id) {
      return Response.json(
        { error: "Post or user are required" },
        { status: 400 },
      );
    }

    await db
      .insert(likesTable)
      .values({
        post_id,
        user_id,
      })
      .returning();

    return Response.json({ data: "ok" }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
