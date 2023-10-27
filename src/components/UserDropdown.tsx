import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/DropdownMenu";
import { UserAvatar } from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

interface UserDropdownProps {
  user: {
    image: string;
    id: string;
    email: string;
    username: string;
  };
  id: string;
}

export const UserDropdown: FC<UserDropdownProps> = ({ user, id }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{
            name: user.username || null,
            image: user.image,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gp-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {/* {user.name && <p>{user.name}</p>}  */}

            {user.username && <p className="font-medium">{user.username}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${id}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
