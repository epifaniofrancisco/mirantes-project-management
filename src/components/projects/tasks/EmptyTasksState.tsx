import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare } from "lucide-react";

interface EmptyTasksStateProps {
  onCreateTask?: () => void;
  message?: string;
  showCreateButton?: boolean;
}

export const EmptyTasksState: React.FC<EmptyTasksStateProps> = ({
  onCreateTask,
  message = "Nenhuma tarefa encontrada",
  showCreateButton = true,
}) => {
  return (
    <Card>
      <CardContent className="py-8 text-center sm:py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
            <CheckSquare className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 sm:text-lg">
              {message}
            </h3>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              {message.includes("encontrada")
                ? "Tente ajustar os filtros ou criar uma nova tarefa"
                : "Comece criando sua primeira tarefa"}
            </p>
          </div>
          {showCreateButton && onCreateTask && (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              {message.includes("encontrada")
                ? "Nova Tarefa"
                : "Criar Primeira Tarefa"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
