"use client";

import { useInfiniteScroll } from "@/app/lib/use-infinite-scroll";
import { getPosts, PostsData } from "../controller/get-posts";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function FeedPosts({ posts }: { posts: PostsData[] }) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [data, setData] = useState<PostsData[]>(posts);
  const size = 10;

  const getPostsData = useCallback(async () => {
    const res = await getPosts({ size: 10, cursor });

    if (cursor && res.data.length === size) {
      const nextCursor = res.data[res.data.length - 1].id;
      setCursor(nextCursor);
      setData((prev) => [...prev, ...res.data]);
      return res.data;
    }

    return [];
  }, [cursor, data]);

  useEffect(() => {
    if (data.length > 0) {
      setCursor(data[data.length - 1].id);
    }
  }, []);

  const { isFetching, targetRef } = useInfiniteScroll(getPostsData);

  return (
    <div className="space-y-4">
      {data.map((tweet) => (
        <div
          key={tweet.id}
          className="border border-gray-300 p-4 rounded-lg shadow-sm"
        >
          <div className="flex gap-2 items-end">
            <div className="size-8 border rounded-full"></div>
            <div className="font-bold">{tweet.author.name}</div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-700">{tweet.content}</div>
            {tweet.image_src && (
              <Image
                src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${tweet.image_src}`}
                alt="image"
                width={500}
                height={500}
              />
            )}
          </div>
        </div>
      ))}
      <div ref={targetRef}>
        {isFetching ? "Loading more..." : "End of data"}
      </div>
    </div>
  );
}
