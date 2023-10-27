import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { title, content, imageUrls } = PostValidator.parse(body);
    console.log({ title, content, imageUrls });

    let url = JSON.stringify(imageUrls);
    const { id } = await db.post.create({
      data: {
        title,
        authorId: user.id!,
        content,
        imageUrls: url,
      },
    });

    return new Response(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not create post ${error}`, {
        status: 500,
      });
    }
  }
}
