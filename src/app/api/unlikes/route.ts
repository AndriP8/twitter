import { db } from "@/app/database/client";
import { likesTable, likeUpdateSchema } from "@/app/database/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function DELETE(req: NextRequest) {
  try {
    const { post_id, user_id } = (await req.json()) as z.infer<
      typeof likeUpdateSchema
    >;
    if (!post_id || !user_id) {
      return Response.json(
        { error: "Post or user are required" },
        { status: 400 },
      );
    }
    await db
      .delete(likesTable)
      .where(
        and(eq(likesTable.post_id, post_id), eq(likesTable.user_id, user_id)),
      )
      .returning();
    return Response.json({ data: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
