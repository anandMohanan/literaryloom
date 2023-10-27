import { db } from "@/lib/db";
import { CreateCommentValidator } from "@/lib/validators/comment";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CreateCommentValidator.parse(body);
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        postId,
        text,
        authorId: user.id!,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not create comment ${error}`, {
        status: 500,
      });
    }
  }
}
