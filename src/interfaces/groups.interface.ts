import { z } from "zod";

const createGroupSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(100),
});

export { createGroupSchema };
