export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const;

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export const TASK_STATUS_CONFIG = {
  [TASK_STATUS.PENDING]: {
    label: "Pendente",
    icon: "AlertCircle",
    iconColor: "text-yellow-500",
    badgeClass: "bg-yellow-100 text-yellow-800",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: "Em Progresso",
    icon: "Clock",
    iconColor: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  [TASK_STATUS.COMPLETED]: {
    label: "Concluída",
    icon: "CheckCircle",
    iconColor: "text-green-500",
    badgeClass: "bg-green-100 text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
} as const;

export const TASK_PRIORITY_CONFIG = {
  [TASK_PRIORITY.LOW]: {
    label: "Baixa",
    icon: "Flag",
    color: "text-green-500",
    bgColor: "bg-green-50",
    order: 1,
  },
  [TASK_PRIORITY.MEDIUM]: {
    label: "Média",
    icon: "Flag",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    order: 2,
  },
  [TASK_PRIORITY.HIGH]: {
    label: "Alta",
    icon: "Flag",
    color: "text-red-500",
    bgColor: "bg-red-50",
    order: 3,
  },
} as const;

export const TASK_FILTERS = {
  ALL: "all",
  MY_TASKS: "my-tasks",
  PENDING: TASK_STATUS.PENDING,
  IN_PROGRESS: TASK_STATUS.IN_PROGRESS,
  COMPLETED: TASK_STATUS.COMPLETED,
} as const;

export const TASK_SORT_OPTIONS = {
  CREATED_DATE: "createdAt",
  DUE_DATE: "dueDate",
  PRIORITY: "priority",
  STATUS: "status",
  TITLE: "title",
} as const;

export const DEFAULT_TASK_FORM = {
  title: "",
  description: "",
  status: TASK_STATUS.PENDING,
  priority: TASK_PRIORITY.MEDIUM,
  assignedTo: "",
  dueDate: "",
  tags: [],
} as const;
