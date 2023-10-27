import { db } from "@/lib/db";
import { FollowValidator } from "@/lib/validators/follow";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = getUser();
    const { id: userId, action } = FollowValidator.parse(body);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    await db.following.create({
      data: {
        id: user.id!,
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
            id: user.id!,
          },
        },
      },
    });

    return new Response("User followed/unfollowed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);

    return new Response("An error occurred while following the user", {
      status: 400,
    });
  }
}
