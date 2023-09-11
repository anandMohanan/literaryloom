import { z } from "zod";

export const CreateCommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CreateCommentValidator>;

export const DeleteCommentValidator = z.object({
  commentId: z.string(),
});

export type DeletecommentRequest = z.infer<typeof DeleteCommentValidator>;
