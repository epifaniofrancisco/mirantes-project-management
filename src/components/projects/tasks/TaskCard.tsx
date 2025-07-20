"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { MemberAvatar } from "@/components/projects/members/MemberAvatar"; 
import { formatDate, isTaskOverdue } from "@/lib/utils";
import type { Task, Project } from "@/lib/types";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { useTaskOperations } from "@/hooks/projects/tasks/useTaskOperations";
import { TaskFormDialog } from "./TaskFormDialog";

interface TaskCardProps {
  task: Task;
  project: Project;
  compact?: boolean;
  showProject?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
}

export function TaskCard({
  task,
  project,
  compact = false,
  showProject = false,
  onEdit,
  onDelete,
  onStatusChange,
}: Readonly<TaskCardProps>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { deleteTask, updateTask } = useTaskOperations();

  const isOverdue = isTaskOverdue(task);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    } else {
      setShowEditDialog(true);
    }
  }, [task, onEdit]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(task.id);
    } else {
      setShowDeleteDialog(true);
    }
  }, [task.id, onDelete]);

  const handleConfirmDelete = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask(taskId);
      } catch (error: any) {
        console.error("Erro ao deletar task:", error);
        throw error;
      }
    },
    [deleteTask],
  );

  const handleStatusChange = useCallback(
    async (newStatus: Task["status"]) => {
      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
        return;
      }

      try {
        await updateTask(task.id, { status: newStatus }, project);
      } catch (error: any) {
        console.error("Erro ao atualizar status:", error);
      }
    },
    [task.id, onStatusChange, updateTask, project],
  );

  const assignedMember = task.assignedTo
    ? project.members?.find((member) => member.userId === task.assignedTo)
    : null;

  const cardClasses = `
    transition-all duration-200 hover:shadow-md
    ${isOverdue ? "ring-2 ring-red-200 bg-red-50" : ""}
    ${compact ? "p-3" : "p-4 sm:p-6"}
  `.trim();

  return (
    <>
      <Card className={cardClasses}>
        <CardContent className={compact ? "p-4" : "p-4 sm:p-6"}>
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start gap-2">
                {isOverdue && (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                )}
                <h3
                  className={`line-clamp-2 font-semibold ${
                    compact ? "text-sm" : "text-base sm:text-lg"
                  } ${isOverdue ? "text-red-700" : ""}`}
                >
                  {task.title}
                </h3>
              </div>

              {!compact && task.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {task.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TaskStatusBadge
              status={task.status}
              size={compact ? "sm" : "md"}
              onClick={handleStatusChange}
            />

            {task.priority && (
              <TaskPriorityBadge
                priority={task.priority}
                size={compact ? "sm" : "md"}
              />
            )}

            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Atrasada
              </Badge>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {task.tags.slice(0, compact ? 2 : 5).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {compact && task.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Footer Info */}
          <div className="flex flex-col justify-between gap-2 text-sm text-gray-500 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              {assignedMember && (
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    member={assignedMember}
                    size="sm"
                  />
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 ${
                    isOverdue ? "text-red-600" : ""
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className={compact ? "text-xs" : "text-sm"}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}

              {/* Project Name */}
              {showProject && (
                <span className="truncate text-xs text-gray-400">
                  {project.title}
                </span>
              )}
            </div>

            {/* Created Date */}
            {!compact && (
              <span className="text-xs text-gray-400 sm:text-sm">
                Criada em {formatDate(task.createdAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        task={task}
        onConfirm={handleConfirmDelete}
      />

      <TaskFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
        project={project}
        mode="edit"
      />
    </>
  );
}
