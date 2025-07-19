import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { useProjectOperations } from "@/hooks/useProjectOperations";
import type { Project, Task } from "@/lib/types";

interface UseProjectDetailsProps {
  projectId: string;
}

export function useProjectDetails({ projectId }: UseProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const { checkProjectPermissions } = useProjectOperations();

  // Buscar projeto e verificar permissões
  useEffect(() => {
    if (!projectId || !user) return;

    const loadProject = async () => {
      try {
        const { hasPermission, project: fetchedProject } =
          await checkProjectPermissions(projectId, "view");

        if (!fetchedProject) {
          router.push("/dashboard");
          return;
        }

        if (!hasPermission) {
          router.push("/dashboard");
          return;
        }

        setProject(fetchedProject);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, user, router, checkProjectPermissions]);

  // Listener para tarefas em tempo real
  useEffect(() => {
    if (!projectId) return;

    const tasksQuery = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return () => unsubscribeTasks();
  }, [projectId]);

  // Navegação
  const navigateToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const navigateToEdit = useCallback(() => {
    if (project) {
      router.push(`/projects/${project.id}/edit`);
    }
  }, [project, router]);

  const navigateToMembers = useCallback(() => {
    if (project) {
      router.push(`/projects/${project.id}/members`);
    }
  }, [project, router]);

  // Computações derivadas
  const isOwner = project?.createdBy === user?.uid;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const daysRemaining = project
    ? Math.max(
        0,
        Math.ceil(
          (new Date(project.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return {
    // Estado
    project,
    tasks,
    loading,
    user,

    // Computações
    isOwner,
    completedTasks,
    totalTasks,
    progressPercentage,
    daysRemaining,

    // Navegação
    navigateToDashboard,
    navigateToEdit,
    navigateToMembers,
  };
}
