"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { likePost } from "../controller/like-post";
import { clsx } from "clsx";
import { unLikePost } from "../controller/unlike-posts";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { getPosts } from "../controller/get-posts";
import { useInfiniteScroll } from "@/app/lib/use-infinite-scroll";
import { getQueryClient } from "../../get-query-client";

export default function FeedPosts({ userId }: { userId: string }) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [increment, setIncrement] = useState(0);
  const queryClient = getQueryClient();

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts", increment],
    queryFn: async () => {
      const response = await getPosts({
        size: 10,
        cursor,
        userId,
      });
      setCursor(response.pagination.cursor);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    placeholderData: keepPreviousData,
    initialPageParam: undefined,
  });

  const { isFetching, targetRef } = useInfiniteScroll(fetchNextPage);
  const likeMutation = useMutation({
    mutationFn: (postId: string) =>
      likePost({ post_id: postId, user_id: userId }),
    onSettled: () => {
      setIncrement(increment + 1);
      queryClient.invalidateQueries({ queryKey: ["posts", increment] });
    },
  });
  const handleLike = async (postId: string) => {
    likeMutation.mutate(postId);
  };
  const unLikeMutation = useMutation({
    mutationFn: (postId: string) =>
      unLikePost({ post_id: postId, user_id: userId }),
    onSettled: () => {
      setIncrement(increment + 1);
      queryClient.invalidateQueries({ queryKey: ["posts", increment] });
    },
  });
  const handleUnLike = async (postId: string) => {
    unLikeMutation.mutate(postId);
  };

  return (
    <div className="space-y-4">
      {data?.pages.map((page, index) => (
        <Fragment key={"page.pagination.cursor" + index}>
          {page?.data.map((tweet) => (
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
              <div className="flex items-center gap-4 w-1/2 mt-4 text-gray-600">
                <button className="cursor-pointer flex-1 flex items-center gap-1 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Comment</span>
                </button>

                <button
                  className={clsx(
                    "cursor-pointer flex-1 flex items-center gap-1 hover:text-red-500",
                    tweet.user_interaction.liked ? "text-red-500" : null,
                  )}
                  onClick={() => {
                    if (tweet.user_interaction.liked) {
                      handleUnLike(tweet.id);
                    } else {
                      handleLike(tweet.id);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <div className="flex gap-2">
                    {tweet.stats.like_count ? (
                      <span>{tweet.stats.like_count}</span>
                    ) : null}
                    <span>Likes</span>
                  </div>
                </button>

                <button className="cursor-pointer flex items-center gap-1 hover:text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </Fragment>
      ))}
      <div ref={targetRef}>
        {isFetching ? "Loading more..." : "End of data"}
      </div>
    </div>
  );
}
