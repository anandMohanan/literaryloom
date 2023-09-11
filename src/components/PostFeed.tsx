"use client";

import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { PostComponent } from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
}

export const PostFeed = ({ initialPosts }: PostFeedProps) => {
  const { data: session } = useSession();
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/post/fetchPosts?limit=${INFINITY_SCROLLING_PAGINATION_VALUE}&page=${pageParam}`;

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  if (posts.length == 0) {
    return (
      <>
        <h1 className="text-center">No posts in this community.</h1>
      </>
    );
  } else
    return (
      <ul className="flex flex-col col-span-2 space-y-6 mb-10 lg:mb-30">
        {posts.map((post, i) => {
          const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);
          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
          );

          if (i === posts.length - 1) {
            return (
              <li key={post.id} ref={ref}>
                <PostComponent
                  commentAmt={post.comments.length}
                  post={post}
                  currentVote={currentVote}
                  votesAmt={votesAmt}
                />
              </li>
            );
          } else {
            return (
              <PostComponent
                commentAmt={post.comments.length}
                post={post}
                currentVote={currentVote}
                votesAmt={votesAmt}
                key={post.id}
              />
            );
          }
        })}
      </ul>
    );
};
