"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { useDashboard } from "@/hooks/useDashboard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { UserInfo } from "@/components/UserInfo";

interface EmptyStateProps {
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAction }) => (
  <Card className="py-8 text-center sm:py-12">
    <CardContent>
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
          <Plus className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
        </div>
        <div className="px-4">
          <h3 className="text-base font-medium text-gray-900 sm:text-lg">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Comece criando seu primeiro projeto
          </p>
        </div>
        <Button onClick={onAction} className="w-full sm:w-auto">
          Criar Primeiro Projeto
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage(): React.ReactElement {
  const {
    projects,
    user,
    loading,
    handleSignOut,
    navigateToNewProject,
    navigateToProject,
    navigateToEditProject,
  } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4">
      <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        <DashboardHeader
          user={user}
          onNewProject={navigateToNewProject}
          onSignOut={handleSignOut}
        />

        {/* Card de Informações do Usuário */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:pt-6">
            <UserInfo
              user={user}
              projectsCount={projects.length}
              layout="horizontal"
            />
          </CardContent>
        </Card>

        {/* Seção de Projetos */}
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
            Meus projetos
          </h2>

          {projects.length === 0 ? (
            <EmptyState onAction={navigateToNewProject} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={navigateToProject}
                  onEdit={navigateToEditProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
