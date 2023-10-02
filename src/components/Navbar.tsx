import Link from "next/link";
import { Button, buttonVariants } from "./ui/Button";
import { UserDropdown } from "./UserDropdown";
import { SearchBar } from "./SearchBar";
import Image from "next/image";
import { getAuthSession } from "@/lib/auth";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

export const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className=" top-0 inset-x-0 h-fit bg-primary-colour  z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <a href="/" className="flex gap-2 items-center lg:w-40">
              <p className="hidden text-zinc-700 text-sm font-medium md:block">
                Literary Loom
              </p>
              <Image
                src="/literaryloom2.png"
                alt="logo"
                width={30}
                height={30}
              />
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src="/literaryloom2.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Literary Loom</h4>
                <p className="text-sm">
                  Welcome to Literary Loom, where words are woven into intricate
                  tapestries of imagination and emotion. We are a passionate
                  community of writers, readers, and literary enthusiasts who
                  believe in the power of storytelling to inspire, enlighten,
                  and connect us all.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <SearchBar />
        {session?.user ? (
          <UserDropdown user={session.user} id={session.user.id} />
        ) : (
          <Link href="/signIn" className={`w-40 ${buttonVariants()}`}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};
