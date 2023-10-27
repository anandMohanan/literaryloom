"use client";

import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { PostCommentVoteClient } from "./CommentVotes";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { DialogHeader, DialogFooter } from "./ui/Dialog";

import { useMutation } from "@tanstack/react-query";
import { DeletecommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostcommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
  hide: boolean;
  commentAuthorId: string;
  user?: KindeUser;
}

export const Postcomment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
  hide,
  commentAuthorId,
  user,
}: PostcommentProps) => {
  const router = useRouter();

  const { mutate: DeleteComment, isLoading } = useMutation({
    mutationFn: async ({ commentId }: DeletecommentRequest) => {
      const payload: DeletecommentRequest = { commentId };
      await axios.patch("/api/post/comment/delete", payload);
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Could not delete Comment",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      return toast({
        title: "Comment deleted successfully",
        description: "",
        variant: "default",
      });
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.username || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            {comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <PostCommentVoteClient
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />
        {commentAuthorId === user?.id ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="subtle">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this comment?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  onClick={() => {
                    DeleteComment({ commentId: comment.id });
                  }}
                >
                  Delete Comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
};
