import FeedComposer from "./components/feed-composer";
import FeedPostsClient from "./components/feed-posts-client";
import { getPosts } from "./controller/get-posts";

export default async function Home() {
  const initialPosts = await getPosts({ size: 10 });
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Tweet Composer */}
      <FeedComposer />
      {/* List of Tweets */}
      <FeedPostsClient posts={initialPosts.data} />
    </div>
  );
}
