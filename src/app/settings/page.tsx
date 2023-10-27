import { UpdateAvatarComponent } from "@/components/Settings/UpdateAvatar";
import { UpdteUsernameComponent } from "@/components/Settings/UpdateUsername";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Literary Loom - Settings",
  description: "Literry Loom - Manage account",
};
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({}) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user) {
    redirect("/");
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id!,
    },
    select: {
      id: true,
      username: true,
      image: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-6">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UpdteUsernameComponent
          user={{
            id: dbUser?.id!,
            username: dbUser?.username || "",
            image: dbUser?.image!,
          }}
        />
        <UpdateAvatarComponent
          user={{
            id: dbUser?.id!,
            username: dbUser?.username || "",
            image: dbUser?.image!,
          }}
        />
      </div>
    </div>
  );
};

export default page;
