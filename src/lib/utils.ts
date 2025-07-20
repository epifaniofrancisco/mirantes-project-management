import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  TASK_STATUS_CONFIG,
  TASK_PRIORITY_CONFIG,
  type TaskStatus,
  type TaskPriority,
} from "@/constants/tasks";
import type { Task } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("pt-PT");
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const getInitials = (name?: string, email?: string): string => {
  if (name && name.trim()) {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  if (email) {
    // Se não tem nome, usa as primeiras 2 letras do email
    return email.slice(0, 2).toUpperCase();
  }

  return "??";
};

export const getAvatarColor = (identifier: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const index =
    identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};

export const getTaskStatusConfig = (status: TaskStatus) => {
  return TASK_STATUS_CONFIG[status] || TASK_STATUS_CONFIG.pending;
};

export const getTaskPriorityConfig = (priority: TaskPriority) => {
  return TASK_PRIORITY_CONFIG[priority] || TASK_PRIORITY_CONFIG.medium;
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const priorityA = getTaskPriorityConfig(a.priority as TaskPriority).order;
    const priorityB = getTaskPriorityConfig(b.priority as TaskPriority).order;
    return priorityB - priorityA; // Alta prioridade primeiro
  });
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

export const filterTasksByStatus = (
  tasks: Task[],
  status: TaskStatus,
): Task[] => {
  return tasks.filter((task) => task.status === status);
};

export const filterTasksByAssignee = (
  tasks: Task[],
  userId: string,
): Task[] => {
  return tasks.filter((task) => task.assignedTo === userId);
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return {
    pending: filterTasksByStatus(tasks, "pending"),
    inProgress: filterTasksByStatus(tasks, "in-progress"),
    completed: filterTasksByStatus(tasks, "completed"),
  };
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = filterTasksByStatus(tasks, "completed").length;
  const inProgress = filterTasksByStatus(tasks, "in-progress").length;
  const pending = filterTasksByStatus(tasks, "pending").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    progress,
  };
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && task.status !== "completed";
};

export const getTasksOverdue = (tasks: Task[]): Task[] => {
  return tasks.filter(isTaskOverdue);
};

export const getTasksBySearch = (tasks: Task[], searchTerm: string): Task[] => {
  if (!searchTerm.trim()) return tasks;

  const term = searchTerm.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.tags?.some((tag) => tag.toLowerCase().includes(term)),
  );
};