"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Edit,
  MessageCircle,
  User,
  Flag,
  X,
} from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { MemberAvatar } from "@/components/projects/members/MemberAvatar";
import { formatDate } from "@/lib/utils";
import type { Task, Project } from "@/lib/types";
import { CommentsList } from "./comments/CommentList";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  project: Project;
  onEdit?: () => void;
}

export function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  project,
  onEdit,
}: Readonly<TaskDetailsDialogProps>) {
  const assignedMember = task.assignedTo
    ? project.members?.find((member) => member.userId === task.assignedTo)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-2 my-4 max-h-[95vh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto p-4 sm:mx-4 sm:my-8 sm:p-6 lg:max-w-5xl">
        <DialogHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
                <FileText className="h-5 w-5" />
                {task.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 text-sm sm:text-base">
                Detalhes da tarefa
              </DialogDescription>
            </div>

            {/* Actions */}
            <div className="ml-4 flex items-center gap-2">
              {onEdit && (
                <Button onClick={onEdit} size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Task Details - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Status and Priority */}
            <div className="flex flex-wrap items-center gap-3">
              <TaskStatusBadge
                status={task.status}
                size="md"
                showDropdown={false}
              />

              {task.priority && (
                <TaskPriorityBadge
                  priority={task.priority}
                  size="md"
                />
              )}
            </div>

            {/* Description */}
            {task.description && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Descrição</h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-medium text-gray-900">
                <MessageCircle className="h-5 w-5" />
                Comentários
              </h3>
              <CommentsList task={task} project={project} />
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">Informações</h3>

              {/* Assigned To */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                  <User className="h-4 w-4" />
                  Responsável
                </label>
                {assignedMember ? (
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={assignedMember} size="sm" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Não atribuído</p>
                )}
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Data de Vencimento
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              )}

              {/* Created */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Criada em
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(task.createdAt)}
                </p>
              </div>

              {/* Updated */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Atualizada em
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>

            {/* Project Info */}
            <div className="space-y-2 rounded-lg bg-blue-50 p-4">
              <h3 className="font-medium text-blue-900">Projeto</h3>
              <p className="text-sm text-blue-800">{project.title}</p>
              {project.description && (
                <p className="line-clamp-2 text-xs text-blue-600">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
