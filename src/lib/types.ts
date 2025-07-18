import { registerSchema } from "@/lib/validations/auth";
import type { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
}

export type UserData = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type RegisterFormData = z.infer<typeof registerSchema>;
