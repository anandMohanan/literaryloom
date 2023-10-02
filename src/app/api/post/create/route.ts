import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscribeToCommunityValidator } from "@/lib/validators/communities";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { title, content, imageUrls } = PostValidator.parse(body);

    let url = JSON.stringify(imageUrls);
    const { id } = await db.post.create({
      data: {
        title,
        authorId: session?.user.id,
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
