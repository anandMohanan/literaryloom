import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostFeed } from "./PostFeed";

export const UserPosts = async () => {
  const session = await getAuthSession();

  const posts = await db.post.findMany({
    where: {
      authorId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
    },
  });
  return <PostFeed initialPosts={posts} />;
};
