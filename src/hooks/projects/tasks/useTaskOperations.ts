"use client";

import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { taskSchema } from "@/lib/validations/task";
import type { Task, TaskFormData, Project } from "@/lib/types";

const convertTimestamp = (timestamp: any, fieldName: string): string => {
  try {
    if (!timestamp) {
      console.warn(`⚠️ ${fieldName} is null/undefined`);
      return new Date().toISOString();
    }

    if (timestamp?.toDate && typeof timestamp.toDate === "function") {
      const date = timestamp.toDate();
      return date.toISOString();
    }

    // String de data
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date string: ${timestamp} for ${fieldName}`);
        return new Date().toISOString();
      }
      return date.toISOString();
    }

    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }

    if (typeof timestamp === "number") {
      const date = new Date(timestamp);
      return date.toISOString();
    }

    console.error(
      `Unknown timestamp type for ${fieldName}:`,
      typeof timestamp,
      timestamp,
    );
    return new Date().toISOString();
  } catch (error) {
    console.error(`Error converting ${fieldName}:`, error);
    return new Date().toISOString();
  }
};

export function useTaskOperations() {
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
      const assignedMember = taskData.assignedTo
        ? project.members?.find(
            (member) => member.userId === taskData.assignedTo,
          )
        : null;

      return {
        ...taskData,
        assignedToName: assignedMember?.name || assignedMember?.email || null,
        assignedToAvatar: assignedMember?.avatar || null,
      };
    },
    [],
  );

  const listenToTasks = useCallback(
    (projectId: string, callback: (tasks: Task[]) => void) => {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc"),
      );

      return onSnapshot(
        tasksQuery,
        (snapshot) => {
          const tasks = snapshot.docs.map((doc, index) => {
            const data = doc.data();

            console.log(`🔍 Processing task ${index + 1}:`, {
              id: doc.id,
              title: data.title,
              createdAtRaw: data.createdAt,
              createdAtType: typeof data.createdAt,
              hasToDate: data.createdAt?.toDate ? "yes" : "no",
              updatedAtRaw: data.updatedAt,
              updatedAtType: typeof data.updatedAt,
            });

            const processedTask = {
              id: doc.id,
              ...data,
              createdAt: convertTimestamp(data.createdAt, "createdAt"),
              updatedAt: convertTimestamp(data.updatedAt, "updatedAt"),
            } as Task;

            console.log(`✅ Processed task ${index + 1}:`, {
              id: processedTask.id,
              title: processedTask.title,
              createdAt: processedTask.createdAt,
              updatedAt: processedTask.updatedAt,
            });

            return processedTask;
          });

          callback(tasks);
        },
        (error) => {
          console.error("Erro no listener de tasks:", error);
          callback([]);
        },
      );
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

        const returnTask = {
          id: docRef.id,
          ...newTaskData,
          createdAt: newTaskData.createdAt.toDate().toISOString(),
          updatedAt: newTaskData.updatedAt.toDate().toISOString(),
        } as Task;

        return returnTask;
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
      updates: Partial<TaskFormData>,
      project: Project,
    ): Promise<void> => {
      setIsLoading(true);
      try {
        const enrichedUpdates = enrichTaskWithAssignee(
          updates as TaskFormData,
          project,
        );
        const updateData = {
          ...enrichedUpdates,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(doc(db, "tasks", taskId), updateData);
      } catch (error) {
        console.error("Erro ao atualizar task:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [enrichTaskWithAssignee],
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      const currentUser = validateUser();
      setIsLoading(true);

      try {
        await deleteDoc(doc(db, "tasks", taskId));
      } catch (error) {
        console.error("Erro ao deletar task:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const parseTaskError = useCallback((error: any): string => {
    if (error?.message?.includes("não autenticado")) {
      return "Você precisa estar logado para realizar esta ação";
    }

    if (error?.message?.includes("permissão")) {
      return "Você não tem permissão para realizar esta ação";
    }

    return "Erro inesperado. Tente novamente.";
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    listenToTasks,
    parseTaskError,
    isLoading,
  };
}
