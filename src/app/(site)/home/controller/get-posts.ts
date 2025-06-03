import { postSelectSchema, userSelectSchema } from "@/app/database/schema";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

type GetPostsType = {
  size: number;
  cursor?: string;
  userId?: string;
};

export type PostsData = Omit<z.infer<typeof postSelectSchema>, "like_count"> & {
  author: Pick<z.infer<typeof userSelectSchema>, "id" | "name">;
  stats: {
    like_count: number;
  };
  user_interaction: {
    liked: boolean;
  };
};

export type GetPostsResponse = {
  data: PostsData[];
  pagination: {
    cursor?: string;
    size: number;
    has_more: boolean;
  };
};

export async function getPosts({ size, cursor, userId }: GetPostsType) {
  const searchParams = new URLSearchParams();
  searchParams.set("size", size.toString());
  if (cursor) {
    searchParams.set("cursor", cursor);
  }
  if (userId) {
    searchParams.set("user_id", userId);
  }

  const response = await fetch(
    `http://localhost:3000/api/posts?${searchParams}`,
  );
  if (!response.ok) {
    console.log(await response.json());
    throw new Error("Failed to fetch posts");
  }
  const posts = (await response.json()) as GetPostsResponse;
  return posts;
}

export const postsOptions = ({ size, cursor, userId }: GetPostsType) =>
  queryOptions({
    queryKey: ["posts", 0],
    queryFn: async () => {
      const response = await getPosts({
        size,
        cursor,
        userId,
      });
      return {
        pageParams: undefined,
        pages: [response],
        // },
      };
    },
  });
