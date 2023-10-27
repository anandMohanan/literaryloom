import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, id } = z
      .object({
        limit: z.string(),
        page: z.string(),
        id: z.string(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        id: url.searchParams.get("id"),
      });
    console.log(limit, page, id);
    console.log((parseInt(page) - 1) * parseInt(limit));
    let posts;
    if (id !== "undefined") {
      console.log("id is not undefined");

      posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          votes: true,
          author: true,
          comments: true,
        },
        where: {
          authorId: id,
        },
      });
    } else {
      posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          votes: true,
          author: true,
          comments: true,
        },
      });
    }
    console.log("postssfetch", posts);

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not fetch more posts ${error}`, {
        status: 500,
      });
    }
  }
}
