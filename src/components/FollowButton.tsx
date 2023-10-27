"use client";

import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";

interface FollowButtonProps {
  params: {
    userId: string;
  };
}

export const FollowButton = ({ params }: FollowButtonProps) => {
  const {} = useMutation({
    mutationFn: async () => {},
  });
  return (
    <div className="p-5">
      {/* <Button disabled={session?.user.id == params.userId}>Follow</Button> */}
    </div>
  );
};
