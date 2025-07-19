import type React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface TaskStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const TASK_STATUS_CONFIG = {
  todo: {
    label: "A Fazer",
    icon: AlertCircle,
    iconColor: "text-gray-400",
  },
  "in-progress": {
    label: "Em Progresso",
    icon: Clock,
    iconColor: "text-blue-500",
  },
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
} as const;

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  showIcon = true,
  showText = true,
}) => {
  const config =
    TASK_STATUS_CONFIG[status as keyof typeof TASK_STATUS_CONFIG] ||
    TASK_STATUS_CONFIG.todo;

  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2">
      {showIcon && <IconComponent className={`h-4 w-4 ${config.iconColor}`} />}
      {showText && (
        <Badge variant="outline" className="text-xs">
          {config.label}
        </Badge>
      )}
    </div>
  );
};
