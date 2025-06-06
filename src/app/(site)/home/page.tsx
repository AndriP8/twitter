import { cookies } from "next/headers";
import FeedComposer from "./components/feed-composer";
import FeedPostsClient from "./components/feed-posts-client";
import { getPosts, postsOptions } from "./controller/get-posts";
import jwt from "jsonwebtoken";
import { getQueryClient } from "../get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = jwt.verify(token!, process.env.JWT_SECRET!) as {
    id: string;
    email: string;
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    postsOptions({ userId: user.id, size: 10 }),
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Tweet Composer */}
      <FeedComposer />
      {/* List of Tweets */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FeedPostsClient userId={user.id} />
      </HydrationBoundary>
    </div>
  );
}
