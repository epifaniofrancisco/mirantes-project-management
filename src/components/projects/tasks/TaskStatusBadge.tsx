"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { TASK_STATUS_CONFIG } from "@/constants/tasks";
import type { TaskStatus } from "@/constants/tasks";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
  onClick?: (newStatus: TaskStatus) => void | Promise<void>; 
  disabled?: boolean; 
  showDropdown?: boolean; 
}

export function TaskStatusBadge({
  status,
  size = "md",
  onClick,
  disabled = false,
  showDropdown = true,
}: Readonly<TaskStatusBadgeProps>) {
  const config = TASK_STATUS_CONFIG[status];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (onClick && !disabled) {
      await onClick(newStatus);
    }
  };

  if (!onClick || !showDropdown) {
    return (
      <Badge
        className={`${config.badgeClass} ${sizeClasses[size]} font-medium`}
      >
        {config.label}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          size="sm"
          className={`h-auto ${config.badgeClass} ${sizeClasses[size]} font-medium hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
          disabled={disabled}
        >
          {config.label}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => handleStatusChange("pending")}
          disabled={status === "pending"}
          className="flex items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          Pendente
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("in-progress")}
          disabled={status === "in-progress"}
          className="flex items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Em Andamento
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("completed")}
          disabled={status === "completed"}
          className="flex items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Concluída
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
