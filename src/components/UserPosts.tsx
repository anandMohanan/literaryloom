import { db } from "@/lib/db";
import { PostFeed } from "./PostFeed";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const UserPosts = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const posts = await db.post.findMany({
    where: {
      authorId: user.id!,
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
