import { z } from "zod";

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(3, "Título deve ter pelo menos 3 caracteres")
      .max(100, "Título deve ter no máximo 100 caracteres"),

    description: z
      .string()
      .min(10, "Descrição deve ter pelo menos 10 caracteres")
      .max(500, "Descrição deve ter no máximo 500 caracteres"),

    startDate: z.string().min(1, "Data de início é obrigatória"),

    endDate: z.string().min(1, "Data de fim é obrigatória"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "Data de fim deve ser posterior à data de início",
      path: ["endDate"],
    },
  );

export const memberSchema = z.object({
  email: z.email("Email inválido"),
  role: z.enum(["admin", "member", "viewer"], {
    message: "Papel deve ser admin, member ou viewer",
  }),
});
