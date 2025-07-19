import { forgotPasswordSchema, loginSchema, registerSchema } from "@/lib/validations/auth";
import { memberSchema, projectSchema } from "@/lib/validations/project";
import type { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type UserData = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
}

export interface ProjectMember {
  userId: string
  email: string
  name: string
  role: ProjectMemberRole
  addedAt: string
  avatar?: string
}

export interface FormErrors {
  [key: string]: string;
}

export type ProjectStatus = "planning" | "active" | "completed" | "cancelled";
export type ProjectMemberRole = "admin" | "member" | "viewer";

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;

