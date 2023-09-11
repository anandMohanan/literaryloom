import { db } from "@/lib/db";
import { ExtendedPost, SearchPost } from "@/types/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) return new Response("Invalid query", { status: 400 });

  const postResults = await db.post.findMany({
    where: {
      title: {
        startsWith: q,
      },
    },
    include: {
      author: true,
    },
    take: 5,
  });
  const userResults = await db.user.findMany({
    where: {
      username: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });
  let results = {
    posts: [] as Array<SearchPost>,
    user: [] as Array<typeof userResults>,
  };
  results.posts.push(postResults);
  results.user.push(userResults);

  return new Response(JSON.stringify(results));
}
