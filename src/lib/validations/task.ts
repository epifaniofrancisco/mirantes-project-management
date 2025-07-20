import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),

  status: z.enum(["pending", "in-progress", "completed"], {
    message: "Status deve ser pendente, em andamento ou concluída",
  }),

  assignedTo: z.string().optional(),

  dueDate: z.string().optional(),

  priority: z.enum(["low", "medium", "high"], {
    message: "Prioridade deve ser baixa, média ou alta",
  }),

  tags: z.array(z.string()).default([]),
});

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag deve ter pelo menos 2 caracteres")
    .max(20, "Tag deve ter no máximo 20 caracteres")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Tag deve conter apenas letras, números e espaços",
    ),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato hexadecimal"),
});
