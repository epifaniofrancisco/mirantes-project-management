import { forgotPasswordSchema, loginSchema, registerSchema } from "@/lib/validations/auth";
import { memberSchema, projectSchema } from "@/lib/validations/project";
import type { z } from "zod";
import { tagSchema, taskSchema } from "./validations/task";
import { TaskPriority, TaskStatus } from "@/constants/tasks";

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
  status: ProjectStatus;
  createdBy: string;
  members: ProjectMember[];
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string
  email: string
  name: string
  role: ProjectMemberRole
  addedAt: string
  avatar?: string
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  dueDate?: string;
  priority: TaskPriority;
  tags: string[];
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTag {
  id: string;
  name: string;
  color: string;
  projectId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  projectId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdByAvatar?: string;
  createdAt: string;
  updatedAt: string;
  edited?: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export type ProjectStatus = "planning" | "active" | "completed" | "cancelled";
export type ProjectMemberRole = "admin" | "member" | "viewer";

export const SIZE_CONFIG = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

export type AvatarSize = keyof typeof SIZE_CONFIG;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type TagFormData = z.infer<typeof tagSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
