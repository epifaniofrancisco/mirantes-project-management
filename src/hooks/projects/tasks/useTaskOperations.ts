import { useState, useCallback } from "react";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { taskSchema } from "@/lib/validations/task";
import type { Task, TaskFormData, Project } from "@/lib/types";

interface UseTaskOperationsReturn {
  createTask: (
    data: TaskFormData,
    projectId: string,
    project: Project,
  ) => Promise<Task>;
  updateTask: (
    taskId: string,
    data: Partial<TaskFormData>,
    project: Project,
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  batchUpdateTasks: (
    updates: Array<{ id: string; data: Partial<TaskFormData> }>,
  ) => Promise<void>;

  listenToTasks: (
    projectId: string,
    callback: (tasks: Task[]) => void,
  ) => () => void;

  parseTaskError: (error: any) => string;

  isLoading: boolean;
  currentUser: ReturnType<typeof useAuthState>[0];
}

export function useTaskOperations(): UseTaskOperationsReturn {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  const validateUser = useCallback(() => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    return user;
  }, [user]);

  const enrichTaskWithAssignee = useCallback(
    (taskData: TaskFormData, project: Project) => {
      if (!taskData.assignedTo) {
        return {
          ...taskData,
          assignedToName: "",
          assignedToAvatar: "",
        };
      }

      const assignedMember = project.members?.find(
        (member) => member.userId === taskData.assignedTo,
      );

      return {
        ...taskData,
        assignedToName: assignedMember?.name || "",
        assignedToAvatar: assignedMember?.avatar || "",
      };
    },
    [],
  );

  const createTask = useCallback(
    async (
      taskData: TaskFormData,
      projectId: string,
      project: Project,
    ): Promise<Task> => {
      const currentUser = validateUser();
      setIsLoading(true);

      try {
        const validatedData = taskSchema.parse(taskData);
        const enrichedData = enrichTaskWithAssignee(validatedData, project);

        const newTaskData = {
          ...enrichedData,
          projectId,
          createdBy: currentUser.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "tasks"), newTaskData);

        return {
          id: docRef.id,
          ...newTaskData,
          createdAt: newTaskData.createdAt.toDate().toISOString(),
          updatedAt: newTaskData.updatedAt.toDate().toISOString(),
        } as Task;
      } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser, enrichTaskWithAssignee],
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      taskData: Partial<TaskFormData>,
      project: Project,
    ): Promise<void> => {
      validateUser();
      setIsLoading(true);

      try {
        const updateData: Record<string, any> = {
          ...taskData,
          updatedAt: Timestamp.now(),
        };

        if (taskData.assignedTo !== undefined) {
          if (taskData.assignedTo) {
            const assignedMember = project.members?.find(
              (member) => member.userId === taskData.assignedTo,
            );

            if (assignedMember) {
              updateData.assignedToName = assignedMember.name || "";
              updateData.assignedToAvatar = assignedMember.avatar || "";
            } else {
              updateData.assignedToName = "";
              updateData.assignedToAvatar = "";
            }
          } else {
            updateData.assignedToName = "";
            updateData.assignedToAvatar = "";
          }
        }

        await updateDoc(doc(db, "tasks", taskId), updateData);
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      validateUser();
      setIsLoading(true);

      try {
        await deleteDoc(doc(db, "tasks", taskId));
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: Task["status"]): Promise<void> => {
      try {
        await updateDoc(doc(db, "tasks", taskId), {
          status,
          updatedAt: Timestamp.now(),
        });
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        throw error;
      }
    },
    [],
  );

  const batchUpdateTasks = useCallback(
    async (
      updates: Array<{ id: string; data: Partial<TaskFormData> }>,
    ): Promise<void> => {
      validateUser();
      setIsLoading(true);

      try {
        const promises = updates.map(({ id, data }) =>
          updateDoc(doc(db, "tasks", id), {
            ...data,
            updatedAt: Timestamp.now(),
          }),
        );

        await Promise.all(promises);
      } catch (error) {
        console.error("Erro ao atualizar tarefas em lote:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const listenToTasks = useCallback(
    (projectId: string, callback: (tasks: Task[]) => void) => {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc"),
      );

      return onSnapshot(tasksQuery, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          updatedAt:
            doc.data().updatedAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        })) as Task[];
        callback(tasks);
      });
    },
    [],
  );

  const parseTaskError = useCallback((error: any): string => {
    if (error?.message?.includes("não autenticado")) {
      return "Você precisa estar logado para realizar esta ação";
    }

    if (error?.name === "ZodError") {
      return "Dados da tarefa são inválidos";
    }

    if (error?.message?.includes("permission")) {
      return "Você não tem permissão para realizar esta ação";
    }

    return "Erro inesperado. Tente novamente.";
  }, []);

  return {
    // Operations
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    batchUpdateTasks,

    // Listeners
    listenToTasks,

    // Utils
    parseTaskError,

    // State
    isLoading,
    currentUser: user,
  };
}
