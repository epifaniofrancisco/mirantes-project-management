import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberAvatar } from "./members/MemberAvatar";
import type { Project } from "@/lib/types";

interface ProjectOverviewCardsProps {
  project: Project;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  daysRemaining: number;
}

export const ProjectOverviewCards: React.FC<ProjectOverviewCardsProps> = ({
  project,
  completedTasks,
  totalTasks,
  progressPercentage,
  daysRemaining,
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Progresso das Tarefas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Progresso das Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-sm text-gray-500">
            {progressPercentage}% concluído
          </p>
        </CardContent>
      </Card>

      {/* Membros da Equipe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Membros da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {project.members?.length || 0}
          </div>
          <div className="mt-2 flex -space-x-2">
            {project.members?.slice(0, 5).map((member, index) => (
              <MemberAvatar
                key={member.userId}
                member={member}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {project.members && project.members.length > 5 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600">
                +{project.members.length - 5}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dias Restantes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            Dias Restantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysRemaining}</div>
          <p className="text-sm text-gray-500">até o prazo final</p>
        </CardContent>
      </Card>
    </div>
  );
};
