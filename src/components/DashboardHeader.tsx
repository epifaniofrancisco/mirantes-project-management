import type React from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import type { User } from "@/lib/types";

interface DashboardHeaderProps {
  user: User;
  onNewProject: () => void;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onNewProject,
  onSignOut,
}) => (
  <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Dashboard <strong className="text-primary">Mirantes-PM</strong>
      </h1>
      <p className="mt-1 text-sm text-gray-600 sm:text-base">
        Bem-vindo, <span className="font-medium">{user.name}</span>.
      </p>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <Button
        onClick={onNewProject}
        className="flex w-full items-center justify-center gap-2 sm:w-auto"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Novo Projeto</span>
        <span className="sm:hidden">Novo</span>
      </Button>

      <Button
        onClick={onSignOut}
        variant="outline"
        size="sm"
        className="flex w-full items-center justify-center gap-2 sm:w-auto"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sair</span>
        <span className="sm:hidden">Logout</span>
      </Button>
    </div>
  </div>
);