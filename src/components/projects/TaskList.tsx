import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface TasksListProps {
  tasks: Task[];
}

export const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Nenhuma tarefa criada ainda</p>
          <Button className="mt-4">Criar Primeira Tarefa</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <h3 className="font-medium">{task.title}</h3>
                </div>
                <p className="mb-2 text-sm text-gray-600">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {task.assignedToName && (
                    <span>Atribuído a: {task.assignedToName}</span>
                  )}
                  {task.dueDate && (
                    <span>Prazo: {formatDate(task.dueDate)}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
