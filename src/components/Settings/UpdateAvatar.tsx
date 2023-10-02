"use client";

import { toast } from "@/hooks/use-toast";
import {
  UseravatarRequest,
  RemoveUseravatarRequest,
} from "@/lib/validators/useravatar";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import router from "next/router";
import { uploadFiles } from "../UploadThing";
import { UserAvatar } from "../UserAvatar";

import { Button } from "../ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@prisma/client";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username" | "image" | "name">;
}

export const UpdateAvatarComponent = ({
  user,
  className,
  ...props
}: UserNameFormProps) => {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<unknown[]>();
  const [updateAvatarButtonState, setUpdateAvatarButtonState] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error
    let file = Array.from(e.target.files);

    setAvatarFile(file);
    setUpdateAvatarButtonState(true);

    // const [res] = await uploadFiles(file, "imageUploader");
    // setAvatarUrl(res.fileUrl);
    // updateUseravatar({ fileUrl: res.fileUrl });
  };

  const { mutate: updateUseravatar, isLoading: isAvatarLoading } = useMutation({
    mutationFn: async () => {
      const [res] = await uploadFiles(avatarFile as File[], "imageUploader");

      const payload: UseravatarRequest = {
        fileUrl: res.fileUrl,
        fileKey: res.fileKey,
      };

      const { data } = await axios.patch(
        `/api/user/?q=updateUserAvatar`,
        payload
      );
      setUpdateAvatarButtonState(false);
      setAvatarFile(undefined);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }

      return toast({
        title: "Something went wrong.",
        description: "Your useravatar was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your useravatar has been updated.",
      });
      router.refresh();
    },
  });

  const { mutate: removeUseravatar, isLoading: isRemoveAvatarLoading } =
    useMutation({
      mutationFn: async ({ userId }: RemoveUseravatarRequest) => {
        const payload: RemoveUseravatarRequest = { userId };

        const { data } = await axios.patch(
          `/api/user/?q=removeUserAvatar`,
          payload
        );
        return data;
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          return toast({
            title: "Something went wrong",
            variant: "destructive",
          });
        }

        return toast({
          title: "Something went wrong.",
          description: "Your useravatar was not updated. Please try again.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          description: "Your useravatar has been removed.",
        });
        router.refresh();
      },
    });
  return (
    <Card className="bg-deep-champagne border-black">
      <CardHeader>
        <CardTitle>Your display image</CardTitle>
        <CardDescription>Please choose a display image.</CardDescription>
      </CardHeader>

      {/* <UserAvatar
                className="h-8 w-8"
                // user={{
                //   name: user.name || null,
                //   image: user.image || null,
                // }}
                user={{
                  image: user.image,
                }}
              /> */}
      <UserAvatar
        className="h-8 w-8 ml-6"
        user={{
          name: user.name || null,
          image: user.image || null,
        }}
      />
      {/* <input type="file" /> */}

      <Input
        className="w-[400px] pl-6 ml-6 mt-6 mb-6 border-black"
        type="file"
        onChange={(e) => {
          handleUpload(e);
        }}
      />
      <Button
        isLoading={isAvatarLoading}
        onClick={() => updateUseravatar()}
        className="ml-6 mr-4 mb-6"
        disabled={!updateAvatarButtonState}
      >
        Update Avatar
      </Button>
      <Button
        isLoading={isRemoveAvatarLoading}
        onClick={() => removeUseravatar({ userId: user.id })}
      >
        Remove Avatar
      </Button>
    </Card>
  );
};
