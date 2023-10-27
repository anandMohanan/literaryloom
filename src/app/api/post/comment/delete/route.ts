import { db } from "@/lib/db";
import {
  CreateCommentValidator,
  DeleteCommentValidator,
} from "@/lib/validators/comment";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { commentId } = DeleteCommentValidator.parse(body);
    const { getUser } = await getKindeServerSession();
    const user = getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not delete comment ${error}`, {
        status: 500,
      });
    }
  }
}
