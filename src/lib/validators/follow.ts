import { z } from "zod";

export const FollowValidator = z.object({
  id: z.string(),
  action: z.string(),
});

export type FollowPayload = z.infer<typeof FollowValidator>;
