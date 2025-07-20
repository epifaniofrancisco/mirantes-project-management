"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, Project } from "@/lib/types";
import { TaskCard } from "@/components/projects/tasks/TaskCard";
import { useTaskOperations } from "@/hooks/projects/tasks/useTaskOperations";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { TaskFormDialog } from "@/components/projects/tasks/TaskFormDialog";

interface TasksPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TasksPage({ params }: Readonly<TasksPageProps>) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const { listenToTasks } = useTaskOperations();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;

      if (!resolvedParams.id || !user) return;

      const fetchProject = async () => {
        try {
          const projectDoc = await getDoc(
            doc(db, "projects", resolvedParams.id),
          );
          if (projectDoc.exists()) {
            const projectData = {
              id: projectDoc.id,
              ...projectDoc.data(),
            } as Project;

            // Verificar se o usuário tem acesso ao projeto
            const hasAccess =
              projectData.createdBy === user.uid ||
              projectData.members?.some((member) => member.userId === user.uid);

            if (!hasAccess) {
              router.push("/dashboard");
              return;
            }

            setProject(projectData);

            // Setup listener para tarefas
            const unsubscribe = listenToTasks(
              resolvedParams.id,
              (tasksData) => {
                setTasks(tasksData);
                setLoading(false);
              },
            );

            return () => unsubscribe();
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Erro ao buscar projeto:", error);
          router.push("/dashboard");
        }
      };

      fetchProject();
    };

    getParams();
  }, [params, user, router, listenToTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "my-tasks") return task.assignedTo === user?.uid;
    return task.status === filter;
  });

  const tasksByStatus = {
    pending: tasks.filter((task) => task.status === "pending"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/projects/${project.id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Tarefas</h1>
              <p className="text-sm text-gray-600 sm:text-base">
                {project.title}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar tarefas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Tarefas</SelectItem>
                <SelectItem value="my-tasks">Minhas Tarefas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex w-full items-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl font-bold text-gray-900 sm:text-2xl">
                {tasks.length}
              </div>
              <p className="text-xs text-gray-500 sm:text-sm">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl font-bold text-yellow-600 sm:text-2xl">
                {tasksByStatus.pending.length}
              </div>
              <p className="text-xs text-gray-500 sm:text-sm">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                {tasksByStatus["in-progress"].length}
              </div>
              <p className="text-xs text-gray-500 sm:text-sm">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl font-bold text-green-600 sm:text-2xl">
                {tasksByStatus.completed.length}
              </div>
              <p className="text-xs text-gray-500 sm:text-sm">Concluídas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Tabs */}
        <Tabs defaultValue="list" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-3 sm:space-y-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center sm:py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                        <Plus className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900 sm:text-lg">
                          Nenhuma tarefa encontrada
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                          {filter === "all"
                            ? "Comece criando sua primeira tarefa"
                            : "Nenhuma tarefa corresponde ao filtro selecionado"}
                        </p>
                      </div>
                      {filter === "all" && (
                        <Button onClick={() => setShowCreateDialog(true)}>
                          Criar Primeira Tarefa
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} project={project} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="kanban">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
              {/* Pending Column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    Pendentes ({tasksByStatus.pending.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.pending.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={project}
                      compact
                    />
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    Em Andamento ({tasksByStatus["in-progress"].length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {tasksByStatus["in-progress"].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={project}
                      compact
                    />
                  ))}
                </div>
              </div>

              {/* Completed Column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    Concluídas ({tasksByStatus.completed.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.completed.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={project}
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <TaskFormDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            projectId={project.id}
            project={project}
            mode="create"
          />
    </div>
  );
}
