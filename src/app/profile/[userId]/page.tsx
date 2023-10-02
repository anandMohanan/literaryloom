import { FollowButton } from "@/components/FollowButton";
import { PostFeed } from "@/components/PostFeed";
import { ProfileTab } from "@/components/ProfileTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "lucide-react";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: ProfilePageProps) => {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: params.userId,
    },
    select: {
      image: true,
      username: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      authorId: params.userId,
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
      <div className=" mb-20">
        <Card className="">
          <Avatar className="lg:w-20 lg:h-20 m-10">
            <AvatarImage src={user?.image as string} alt="profile image" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <CardContent className="mt-5">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder={`${user?.username}`} readOnly />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="id">Id</Label>
                <Input id="id" placeholder={`${params.userId}`} readOnly />
              </div>
            </div>
          </CardContent>
          {/* <FollowButton params={params} /> */}
        </Card>
      </div>
      <PostFeed initialPosts={posts} />
      {/* <ProfileTab /> */}
    </>
  );
};

export default page;
