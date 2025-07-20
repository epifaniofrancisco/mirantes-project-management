import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comentário não pode estar vazio")
    .max(1000, "Comentário deve ter no máximo 1000 caracteres")
    .trim(),
});
