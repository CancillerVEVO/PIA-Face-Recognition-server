import { z } from "zod";

const maxFileSize = 1024 * 1024 * 5;
const allowedFileTypes = ["image/jpeg", "image/jpg"];

const uploadImageSchema = z.object({
  file: z
    .object({
      size: z.number().max(maxFileSize),
      mimetype: z.string().refine((value) => allowedFileTypes.includes(value)),
    })

    .refine((value) => value.size <= maxFileSize, {
      message: `File size must be less than ${maxFileSize} bytes`,
      path: ["file", "size"],
    })
    .refine((value) => allowedFileTypes.includes(value.mimetype), {
      message: `File type must be one of ${allowedFileTypes.join(", ")}`,
      path: ["file", "mimetype"],
    }),
});

export { uploadImageSchema };
