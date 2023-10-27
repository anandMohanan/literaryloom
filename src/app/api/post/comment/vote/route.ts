import { db } from "@/lib/db";
import { CreateCommentValidator } from "@/lib/validators/comment";

import { CommentVoteValidator, PostVoteValidator } from "@/lib/validators/vote";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: user.id!,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: user.id!,
            },
          },
        });
        return new Response("OK");
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: user.id!,
            },
          },
          data: {
            type: voteType,
          },
        });
      }
      return new Response("OK");
    }
    await db.commentVote.create({
      data: {
        type: voteType,
        userId: user.id!,
        commentId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not register your vote - error:${error}`, {
        status: 500,
      });
    }
  }
}
