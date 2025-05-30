import * as postsRoute from "@/app/api/posts/route";
import { postSelectSchema, userSelectSchema } from "@/app/database/schema";
import { z } from "zod";

type GetPostsType = {
  size: number;
  cursor?: string;
};

export type PostsData = z.infer<typeof postSelectSchema> & {
  author: Pick<z.infer<typeof userSelectSchema>, "id" | "name">;
};

type GetPostsResponse = {
  data: PostsData[];
  pagination: {
    cursor?: string;
    size: number;
    has_more: boolean;
  };
};

export async function getPosts({ size, cursor }: GetPostsType) {
  const searchParams = new URLSearchParams();
  searchParams.set("size", size.toString());
  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const response = await fetch(
    `http://localhost:3000/api/posts?${searchParams}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const posts = (await response.json()) as GetPostsResponse;
  return posts;
}
