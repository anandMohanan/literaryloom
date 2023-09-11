import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { db } from "@/lib/db";
import { PostFeed } from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { GeneralFeed } from "./GeneralFeed";
import { getServerSession } from "next-auth";

export const CustomFeed = async () => {
  const session = await getServerSession();

  let posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
    },
    take: INFINITY_SCROLLING_PAGINATION_VALUE,
  });
  if (posts.length == 0) {
    return (
      // @ts-expect-error server component
      <GeneralFeed />
    );
  } else {
    return <PostFeed initialPosts={posts} />;
  }
};
