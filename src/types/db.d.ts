import { Comment, Community, Post, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type SearchPost = Post & {
  author: User;
};
