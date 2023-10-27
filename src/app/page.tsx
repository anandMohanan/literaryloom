import { CustomFeed } from "@/components/CustomFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { Home as HomeIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6"> */}
      <div className="overflow-hidden h-fit   order-first md:order-last ">
        <div>
          <div className="bg-deep-champagne px-6 py-2 ">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3  bg-deep-champagne  px-6 py-4 text-sm leading-6 ">
            <p className="text-lg">
              Welcome to Literary Loom, where words are woven into intricate
              tapestries of imagination and emotion. We are a passionate
              community of writers, readers, and literary enthusiasts who
              believe in the power of storytelling to inspire, enlighten, and
              connect us all.
            </p>
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-black">
                Your personal Literary Loom frontpage. Come here to check in
                with your favorite people and their posts.
              </p>
            </div>
            {user ? (
              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/post/createPost`}
              >
                Create Post
              </Link>
            ) : (
              <p> Sign in to create posts</p>
            )}
          </dl>
        </div>

        <CustomFeed />
        <div></div>
        {/* </div> */}
      </div>
    </>
  );
}
