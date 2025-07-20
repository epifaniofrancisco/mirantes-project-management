import type React from "react";
import { Flag } from "lucide-react";
import { getTaskPriorityConfig } from "@/lib/utils";
import type { TaskPriority } from "@/constants/tasks";

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  showIcon?: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-3 w-3 text-xs",
  md: "h-4 w-4 text-sm",
  lg: "h-5 w-5 text-base",
} as const;

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
  priority,
  showIcon = true,
  showText = true,
  size = "md",
}) => {
  const config = getTaskPriorityConfig(priority);
  const sizeClass = SIZE_CLASSES[size];

  if (!showIcon && !showText) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      {showIcon && (
        <Flag className={`${sizeClass.split(" ").slice(0, 2).join(" ")}`} />
      )}
      {showText && (
        <span
          className={`font-medium ${sizeClass.split(" ").slice(2).join(" ")}`}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};
