import type React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardActionsProps {
  projectId: string;
  onViewDetails: (projectId: string) => void;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectCardActions: React.FC<ProjectCardActionsProps> = ({
  projectId,
  onViewDetails,
  onEdit,
  onDelete,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Abrir menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={() => onViewDetails(projectId)}>
        <Eye className="mr-2 h-4 w-4" />
        Ver Detalhes
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit(projectId)}>
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 focus:bg-red-50 focus:text-red-600"
        onClick={() => onDelete(projectId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
