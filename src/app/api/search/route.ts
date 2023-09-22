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
    // select: {
    //   _count: true,
    //   id: true,
    // },
    take: 5,
  });

  // Create an object to store both post and user results
  const results = {
    posts: [] as Array<SearchPost>,
    users: [] as Array<(typeof userResults)[0]>, // Use the type of the first element in userResults
  };

  // Push the results into the respective arrays
  results.posts.push(...postResults);
  results.users.push(...userResults);

  return new Response(JSON.stringify(results));
}
