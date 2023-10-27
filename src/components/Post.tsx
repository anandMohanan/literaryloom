"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare, Share, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EditorOutput } from "./EditorOutput";
import { PostVoteClient } from "./postVote/PostVoteClient";
import { Button, buttonVariants } from "./ui/Button";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeletePostPayload } from "@/lib/validators/post";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { revalidatePath } from "next/cache";
import {
  KindeUser,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

type PartialVote = Pick<Vote, "type">;

interface PostComponentProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
  user?: KindeUser;
}

export const PostComponent = ({
  post,
  commentAmt,
  votesAmt,
  currentVote,
  user,
}: PostComponentProps) => {
  const postRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  // const [user, setUser] = useState<any>();
  // const [authStatus, setAuthStatus] = useState(null);

  // console.log(user);

  // // useEffect(() => {
  // //   const getKindeSession = async () => {
  // //     // const res = await axios.get("/api/kindeSession");
  // //     // const data = await res();
  // //     setUser(data.user);
  // //     console.log(data.user, " data user");
  // //     setAuthStatus(data.authenticated);
  // //   };

  // //   getKindeSession();
  // // }, []);

  // const { data } = useQuery({
  //   queryFn: async () => {
  //     const { data } = await axios.get("/api/kindeSession");
  //     return data;
  //   },
  // });

  // setUser(data.user);
  // console.log(data.user, " data user");
  // setAuthStatus(data.authenticated);

  const { mutate: deletePost, isLoading: deleteLoading } = useMutation({
    mutationFn: async ({ postId }: DeletePostPayload) => {
      if (user?.id !== post.authorId) return;
      const payload: DeletePostPayload = { postId };
      const { data } = await axios.patch(`/api/post/delete`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Could not delete Post",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push("/");
      return toast({
        title: "Post deleted successfully",
        description: "",
        variant: "default",
      });
    },
  });
  return (
    <div className="rounded-md bg-deep-champagne shadow border border-black border-double">
      <div className="px-6 py-4 flex justify-between ">
        <PostVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 ">
            <span>
              Post created by{" "}
              <Link
                className="hover:underline hover:decoration-wavy hover:text-green-300"
                href={`/profile/${post.author.id}`}
              >
                {post.author.username}
              </Link>{" "}
            </span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </Link>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-deep-champagne to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gry-50 z-20 text-sm p-4 sm:px-6">
        <div className="w-fit flex items-center gap-2">
          <Link
            className={buttonVariants({
              className: "w-fit flex items-center gap-2",
            })}
            href={`/post/${post.id}`}
          >
            <MessageSquare className="h-4 w-4" /> {commentAmt}
          </Link>
          <hr />
          {post.authorId === user?.id ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Post</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete post {post.title}?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      deletePost({ postId: post.id });
                    }}
                    type="submit"
                    isLoading={deleteLoading}
                  >
                    Delete Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className=" mb-5">Share Post</DialogTitle>
                <DialogDescription>
                  <div className="flex space-x-2">
                    <Input
                      value={`http://literaryloom.vercel.app/post/${post.id}`}
                      readOnly
                    />
                    <Button
                      variant="link"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `http://literaryloom.vercel.app/post/${post.id}`
                        );
                        return toast({
                          title: "Link copied",
                          description: "",
                          variant: "default",
                        });
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
