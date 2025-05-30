"use client";

import dynamic from "next/dynamic";
import { PostsData } from "../controller/get-posts";

const FeedPosts = dynamic(() => import("./feed-posts"), { ssr: false });

export default function FeedPostsClient({ posts }: { posts: PostsData[] }) {
  return <FeedPosts posts={posts} />;
}
