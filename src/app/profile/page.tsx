import { PostFeed } from "@/components/PostFeed";
import { UserAvatar } from "@/components/UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "lucide-react";
import Image from "next/image";

const page = async () => {
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
  return (
    <>
      <div className="flex justify-between mb-20">
        <Avatar className="lg:w-20 lg:h-20">
          <AvatarImage
            src={session?.user.image as string}
            alt="profile image"
          />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <Badge variant="outline"> ID: {session?.user.id}</Badge>
      </div>
      <PostFeed initialPosts={posts} />
    </>
  );
};

export default page;
