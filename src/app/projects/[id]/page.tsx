"use client";

import type React from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Edit, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { useProjectDetails } from "@/hooks/projects/useProjectDetails";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectOverviewCards } from "@/components/projects/ProjectOverviewCards";
import { MembersList } from "@/components/projects/members/MembersList";
import { formatDateRange } from "@/lib/utils";
import { TasksList } from "@/components/projects/TaskList";

interface ProjectDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const resolvedParams = use(params);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="mt-2 flex items-center gap-4">
                <ProjectStatusBadge status={project.status} />
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDateRange(project.startDate, project.endDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  onClick={navigateToMembers}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Gerenciar Membros
                </Button>
                <Button
                  onClick={navigateToEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Project Overview Cards */}
        <ProjectOverviewCards
          project={project}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          progressPercentage={progressPercentage}
          daysRemaining={daysRemaining}
        />

        {/* Tabs */}
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
            <TasksList tasks={tasks} />
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
  );
}
