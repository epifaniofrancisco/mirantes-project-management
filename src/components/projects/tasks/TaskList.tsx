import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { EmptyTasksState } from "./EmptyTasksState";
import type { Task, Project } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  project: Project;
  onCreateTask?: () => void;
  showProject?: boolean;
  compact?: boolean;
  maxItems?: number;
  emptyStateAction?: () => void;
  emptyStateMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  project,
  onCreateTask,
  showProject = false,
  compact = false,
  maxItems,
  emptyStateAction,
  emptyStateMessage,
}) => {
  const displayTasks = maxItems ? tasks.slice(0, maxItems) : tasks;
  const hasMoreTasks = maxItems && tasks.length > maxItems;

  if (tasks.length === 0) {
    return (
      <EmptyTasksState
        onCreateTask={emptyStateAction || onCreateTask}
        message={emptyStateMessage}
      />
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {displayTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          project={project}
          compact={compact}
          showProject={showProject}
        />
      ))}

      {hasMoreTasks && (
        <Card className="border-dashed">
          <CardContent className="py-4 text-center">
            <p className="mb-2 text-sm text-gray-500">
              E mais {tasks.length - maxItems} tarefa(s)...
            </p>
            <Button variant="outline" size="sm" onClick={onCreateTask}>
              Ver todas as tarefas
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
