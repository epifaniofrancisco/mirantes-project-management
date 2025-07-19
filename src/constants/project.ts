export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PROJECT_STATUS_CONFIG = {
  [PROJECT_STATUS.PLANNING]: {
    label: "Planejamento",
    className: "bg-blue-100 text-blue-800",
  },
  [PROJECT_STATUS.ACTIVE]: {
    label: "Ativo",
    className: "bg-green-100 text-green-800",
  },
  [PROJECT_STATUS.COMPLETED]: {
    label: "Concluído",
    className: "bg-gray-100 text-gray-800",
  },
  [PROJECT_STATUS.CANCELLED]: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800",
  },
} as const;
