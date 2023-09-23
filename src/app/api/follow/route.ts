import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FollowValidator } from "@/lib/validators/follow";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await getAuthSession();
    const { id: userId, action } = FollowValidator.parse(body);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    await db.following.create({
      data: {
        id: session.user.id,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await db.follower.create({
      data: {
        id: userId,
        User: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return {
      status: 200,
      body: JSON.stringify({
        message: "User followed/unfollowed successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      status: 500,
      body: JSON.stringify({
        error: "An error occurred while following the user",
      }),
    };
  }
}
