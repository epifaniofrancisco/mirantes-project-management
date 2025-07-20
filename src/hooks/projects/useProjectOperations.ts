import { useState, useCallback } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { projectSchema } from "@/lib/validations/project";
import type { Project, ProjectFormData } from "@/lib/types";

export function useProjectOperations() {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  const readProject = useCallback(
    async (projectId: string): Promise<Project | null> => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", projectId));

        if (!projectDoc.exists()) {
          return null;
        }

        return {
          id: projectDoc.id,
          ...projectDoc.data(),
        } as Project;
      } catch (error) {
        console.error("Erro ao buscar projeto:", error);
        throw error;
      }
    },
    [],
  );

  const checkProjectPermissions = useCallback(
    async (
      projectId: string,
      requiredPermission: "view" | "edit" | "delete" = "view",
    ): Promise<{ hasPermission: boolean; project: Project | null }> => {
      if (!user) {
        return { hasPermission: false, project: null };
      }

      try {
        const project = await readProject(projectId);

        if (!project) {
          return { hasPermission: false, project: null };
        }

        if (requiredPermission === "edit" || requiredPermission === "delete") {
          return {
            hasPermission: project.createdBy === user.uid,
            project,
          };
        }

        const hasPermission =
          project.createdBy === user.uid ||
          (project.members &&
            project.members.some((member) => member.userId === user.uid));

        return { hasPermission, project };
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return { hasPermission: false, project: null };
      }
    },
    [user, readProject],
  );

  const createProject = useCallback(
    async (data: ProjectFormData): Promise<string> => {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      setIsLoading(true);

      try {
        const validatedData = projectSchema.parse(data);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        const creatorMember = {
          userId: user.uid,
          name:
            userData?.name ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "Usuário",
          email: userData?.email || user.email || "",
          role: "owner" as const,
          addedAt: new Date().toISOString(),
        };

        const newProject = {
          ...validatedData,
          status: "planning",
          createdBy: user.uid,
          members: [creatorMember],
          memberIds: [user.uid],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, "projects"), newProject);
        return docRef.id;
      } catch (error) {
        console.error("Erro ao criar projeto:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const updateProject = useCallback(
    async (
      projectId: string,
      data: Partial<ProjectFormData & { status: string }>,
    ): Promise<void> => {
      setIsLoading(true);

      try {
        const { hasPermission } = await checkProjectPermissions(
          projectId,
          "edit",
        );
        if (!hasPermission) {
          throw new Error("Sem permissão para editar este projeto");
        }

        const { status, ...projectData } = data;

        if (Object.keys(projectData).length > 0) {
          projectSchema.parse(projectData);
        }

        const updateData = {
          ...data,
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(db, "projects", projectId), updateData);
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [checkProjectPermissions],
  );

  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      setIsLoading(true);

      try {
        const { hasPermission } = await checkProjectPermissions(
          projectId,
          "delete",
        );
        if (!hasPermission) {
          throw new Error("Sem permissão para deletar este projeto");
        }

        await deleteDoc(doc(db, "projects", projectId));
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [checkProjectPermissions],
  );

  const validateProjectData = useCallback(
    async (
      formData: ProjectFormData,
    ): Promise<{
      success: boolean;
      errors?: Record<string, string>;
    }> => {
      try {
        projectSchema.parse(formData);
        return { success: true };
      } catch (error: any) {
        console.error("Erro de validação:", error);

        if (
          error?.name === "ZodError" &&
          error?.errors &&
          Array.isArray(error.errors)
        ) {
          const fieldErrors: Record<string, string> = {};

          error.errors.forEach((err: any) => {
            if (err?.path && Array.isArray(err.path) && err.path[0]) {
              fieldErrors[err.path[0]] = err.message || "Campo inválido";
            }
          });

          return {
            success: false,
            errors:
              Object.keys(fieldErrors).length > 0
                ? fieldErrors
                : { general: "Dados inválidos" },
          };
        }

        // Outros tipos de erro
        return {
          success: false,
          errors: {
            general: error?.message || "Erro de validação desconhecido",
          },
        };
      }
    },
    [],
  );

  const parseError = useCallback((error: any, operation: string): string => {
    if (error?.message?.includes("não autenticado")) {
      return "Você precisa estar logado para realizar esta ação";
    }

    if (error?.message?.includes("Sem permissão")) {
      return "Você não tem permissão para realizar esta ação";
    }

    if (error?.message?.includes("banco de dados")) {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    switch (operation) {
      case "create":
        return "Erro inesperado ao criar projeto. Tente novamente.";
      case "update":
        return "Erro inesperado ao atualizar projeto. Tente novamente.";
      case "delete":
        return "Erro inesperado ao deletar projeto. Tente novamente.";
      case "fetch":
        return "Erro ao carregar projeto. Tente novamente.";
      default:
        return "Erro inesperado. Tente novamente.";
    }
  }, []);

  return {
    // Operações CRUD
    readProject,
    createProject,
    updateProject,
    deleteProject,

    // Utilitários
    checkProjectPermissions,
    validateProjectData,
    parseError,

    // Estado
    isLoading,
    currentUser: user,
  };
}
