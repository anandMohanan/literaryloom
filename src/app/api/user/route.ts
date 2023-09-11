import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  UseravatarValidator,
  removeUseravatarValidator,
} from "@/lib/validators/useravatar";
import { UsernameValidator } from "@/lib/validators/username";
import { ExtendedPost, SearchPost } from "@/types/db";
import { utapi } from "uploadthing/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!q) return new Response("Invalid query", { status: 400 });

  if (q == "updateUserAvatar") {
    try {
      const body = await req.json();
      const { fileUrl, fileKey } = UseravatarValidator.parse(body);
      console.log("File url", fileUrl);
      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
        select: {
          imageKey: true,
        },
      });

      await utapi.deleteFiles(user?.imageKey as string);
      // update username
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: fileUrl,
          imageKey: fileKey,
        },
      });

      return new Response("OK");
    } catch (error) {
      error;

      if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 400 });
      }
      console.log(error, "errrooroororo");

      return new Response(
        "Could not update username at this time. Please try later",
        { status: 500 }
      );
    }
  } else if (q == "removeUserAvatar") {
    try {
      const body = await req.json();
      const { userId } = removeUseravatarValidator.parse(body);
      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
        select: {
          imageKey: true,
        },
      });

      await utapi.deleteFiles(user?.imageKey as string);
      // update username
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: "",
        },
      });

      return new Response("OK");
    } catch (error) {
      error;

      if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 400 });
      }

      return new Response(
        "Could not update username at this time. Please try later",
        { status: 500 }
      );
    }
  } else if (q == "updateUserName") {
    try {
      const body = await req.json();
      const { name } = UsernameValidator.parse(body);

      // check if username is taken
      const username = await db.user.findFirst({
        where: {
          username: name,
        },
      });

      if (username) {
        return new Response("Username is taken", { status: 409 });
      }

      // update username
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          username: name,
        },
      });

      return new Response("OK");
    } catch (error) {
      error;

      if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 400 });
      }

      return new Response(
        "Could not update username at this time. Please try later",
        { status: 500 }
      );
    }
  }
}
