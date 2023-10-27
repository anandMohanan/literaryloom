import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/Button";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import MobileNav from "./MobileNav";
import { UserDropdown } from "./UserDropdown";
import { db } from "@/lib/db";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  let dbUser;
  if (user) {
    dbUser = await db.user.findFirst({
      where: {
        id: user.id!,
      },
      select: {
        image: true,
        id: true,
        email: true,
        username: true,
      },
    });
  }

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <a href="/" className="z-40 flex font-semibold">
            <span>Literary Loom</span>
          </a>

          <MobileNav isAuth={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Register <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                {/*@ts-expect-error error */}
                <UserDropdown user={dbUser} id={user.id!} />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
