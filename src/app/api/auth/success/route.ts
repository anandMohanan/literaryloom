import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    throw new Error("UNAUTHORIZED");
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  console.log(dbUser);

  if (!dbUser) {
    console.log("inside create db");

    await db.user.create({
      data: {
        id: user.id,
        email: user.email!,
        username: user.given_name!,
      },
    });
  }

  return redirect(`http://literaryloom.vercel.app/`);
}
