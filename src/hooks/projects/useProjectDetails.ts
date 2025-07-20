"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useTaskOperations } from "./tasks/useTaskOperations";
import type { Project, Task } from "@/lib/types";

interface UseProjectDetailsProps {
  projectId: string;
}

interface UseProjectDetailsReturn {
  project: Project | null;
  tasks: Task[];
  loading: boolean;
  isOwner: boolean;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  daysRemaining: number;
  navigateToDashboard: () => void;
  navigateToEdit: () => void;
  navigateToMembers: () => void;
}

export function useProjectDetails({
  projectId,
}: UseProjectDetailsProps): UseProjectDetailsReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const { listenToTasks } = useTaskOperations();

  const isOwner = project?.createdBy === user?.uid;

  const fetchProject = useCallback(async () => {
    if (!projectId || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const projectDoc = await getDoc(doc(db, "projects", projectId));

      if (!projectDoc.exists()) {
        console.error("Projeto não encontrado:", projectId);
        router.push("/dashboard");
        return;
      }

      const projectData = {
        id: projectDoc.id,
        ...projectDoc.data(),
      } as Project;

      const hasAccess =
        projectData.createdBy === user.uid ||
        projectData.members?.some((member) => member.userId === user.uid);

      if (!hasAccess) {
        console.error("Usuário sem acesso ao projeto:", projectId);
        router.push("/dashboard");
        return;
      }

      setProject(projectData);

      const unsubscribe = listenToTasks(projectId, (tasksData) => {
        if (tasksData.length > 0) {
          const firstTask = tasksData[0];
        }

        setTasks(tasksData);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      setLoading(false);
      router.push("/dashboard");
    }
  }, [projectId, user, router, listenToTasks]);

  useEffect(() => {
    const cleanup = fetchProject();

    return () => {
      if (cleanup) {
        cleanup.then((cleanupFn) => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [fetchProject]);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const daysRemaining = project?.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(project.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const navigateToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const navigateToEdit = useCallback(() => {
    router.push(`/projects/${projectId}/edit`);
  }, [router, projectId]);

  const navigateToMembers = useCallback(() => {
    router.push(`/projects/${projectId}/members`);
  }, [router, projectId]);

  return {
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
  };
}
