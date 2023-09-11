import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { UserDropdown } from "./UserDropdown";
import { SearchBar } from "./SearchBar";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const Navbar = async () => {
  const session = await getServerSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-primary-colour  z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center lg:w-40">
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Literary Loom
          </p>
          <Image src="/literaryloom2.png" alt="logo" width={30} height={30} />
        </Link>
        <SearchBar />
        {session?.user ? (
          <UserDropdown user={session.user} />
        ) : (
          <Link href="/signIn" className={`w-40 ${buttonVariants()}`}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};
