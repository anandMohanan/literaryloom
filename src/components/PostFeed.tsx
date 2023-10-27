"use client";

import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import { useEffect, useRef } from "react";
import { PostComponent } from "./Post";
import {
  KindeUser,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  id?: string;
  user?: KindeUser;
}

export const PostFeed = ({ initialPosts, id, user }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   ["infinite-query"],
  // async ({ pageParam = 1 }) => {
  //   const query = `/api/post/fetchPosts?limit=${INFINITY_SCROLLING_PAGINATION_VALUE}&page=${pageParam}&id=${id}`;

  //   const { data } = await axios.get(query);
  //   return data as ExtendedPost[];
  // },
  //   {
  // getNextPageParam: (_: any, pages: string | any[]) => {
  //   return pages.length + 1;
  // },
  //     initialData: { pages: [initialPosts], pageParams: [1] },
  //   }
  // );

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infinite-query"],
    queryFn: async ({ pageParam = 1 }) => {
      const query = `/api/post/fetchPosts?limit=${INFINITY_SCROLLING_PAGINATION_VALUE}&page=${pageParam}&id=${id}`;

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    initialPageParam: 1,
    getNextPageParam: (_: any, pages: string | any[]) => {
      return pages.length + 1;
    },
    initialData: { pages: [initialPosts], pageParams: [1] },
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);
  console.log(data, "datatattaa");

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  if (posts.length == 0) {
    return (
      <>
        <h1 className="text-center">No posts.</h1>
      </>
    );
  } else
    return (
      <ul className="flex flex-col col-span-2 space-y-6 mb-10 lg:mb-30">
        {posts.map((post, i) => {
          const votesAmt = post.votes.reduce(
            (acc: number, vote: { type: string }) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            },
            0
          );
          const currentVote = post.votes.find(
            (vote: { userId: string | null | undefined }) =>
              vote.userId === user?.id
          );

          if (i === posts.length - 1) {
            return (
              <li key={post.id} ref={ref}>
                <PostComponent
                  commentAmt={post.comments.length}
                  post={post}
                  currentVote={currentVote}
                  votesAmt={votesAmt}
                  user={user}
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
                user={user}
              />
            );
          }
        })}
      </ul>
    );
};
