"use client";

import type React from "react";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Edit, UserPlus, Plus, Eye } from "lucide-react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { useProjectDetails } from "@/hooks/projects/useProjectDetails";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectOverviewCards } from "@/components/projects/ProjectOverviewCards";
import { MembersList } from "@/components/projects/members/MembersList";
import { formatDateRange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { TaskList } from "@/components/projects/tasks/TaskList";
import { TaskFormDialog } from "@/components/projects/tasks/TaskFormDialog";

interface ProjectDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailsPage({
  params,
}: Readonly<ProjectDetailsPageProps>) {
  const resolvedParams = use(params);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const router = useRouter();

  const {
    project,
    tasks,
    loading,
    isOwner,
    completedTasks,
    totalTasks,
    progressPercentage,
    daysRemaining,
    navigateToDashboard,
    navigateToEdit,
    navigateToMembers,
  } = useProjectDetails({ projectId: resolvedParams.id });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
          <Button onClick={navigateToDashboard} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToDashboard}
                  className="flex items-center gap-2 self-start sm:shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Voltar</span>
                </Button>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-3xl">
                    {project.title}
                  </h1>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <ProjectStatusBadge status={project.status} />
                    <div className="flex items-center text-xs text-gray-500 sm:text-sm">
                      <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {formatDateRange(project.startDate, project.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/projects/${project.id}/tasks`)}
                  className="flex items-center justify-center gap-2 sm:justify-start"
                  size="sm"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Ver Todas as Tarefas</span>
                  <span className="sm:hidden">Tarefas</span>
                </Button>

                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      onClick={navigateToMembers}
                      className="flex items-center justify-center gap-2 sm:justify-start"
                      size="sm"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Gerir Membros</span>
                      <span className="sm:hidden">Membros</span>
                    </Button>
                    <Button
                      onClick={navigateToEdit}
                      className="flex items-center justify-center gap-2 sm:justify-start"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <ProjectOverviewCards
            project={project}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            progressPercentage={progressPercentage}
            daysRemaining={daysRemaining}
          />

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas ({tasks.length})</TabsTrigger>
              <TabsTrigger value="members">
                Membros ({project.members?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-700">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-6">
                {/* Header da aba de tarefas com botões */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">Tarefas do Projeto</h3>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/projects/${project.id}/tasks`)
                      }
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Todas ({tasks.length})
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("🔥 Botão 'Nova Tarefa' clicado!");
                        setShowCreateTaskDialog(true);
                      }}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Nova Tarefa
                    </Button>
                  </div>
                </div>

                <TaskList
                  tasks={tasks.slice(0, 5)}
                  project={project}
                  onCreateTask={() => {
                    setShowCreateTaskDialog(true);
                  }}
                />

                {tasks.length > 5 && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/projects/${project.id}/tasks`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver mais {tasks.length - 5} tarefas
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="members">
              <MembersList
                project={project}
                isOwner={isOwner}
                onAddMembers={navigateToMembers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Task Dialog */}
      <TaskFormDialog
        open={showCreateTaskDialog}
        onOpenChange={(open) => {
          setShowCreateTaskDialog(open);
        }}
        projectId={project.id}
        project={project}
        mode="create"
      />
    </>
  );
}
