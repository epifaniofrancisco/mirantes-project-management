import { useState, useEffect, useCallback } from "react";
import type { Project, MemberFormData } from "@/lib/types";
import { useBaseForm } from "@/hooks/useBaseForm";
import { useProjectOperations } from "@/hooks/projects/useProjectOperations";
import { useMemberOperations } from "./useMemberOperations";

interface UseMembersPageProps {
  projectId: string;
}

const initialFormData: MemberFormData = {
  email: "",
  role: "member",
};

export function useMembersPage({ projectId }: UseMembersPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    state: { formData, errors, isLoading: formLoading, generalError },
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading: setFormLoading,
    resetErrors,
    resetForm,
    navigateTo,
    handleInputChange: baseHandleInputChange,
  } = useBaseForm<MemberFormData>(initialFormData);

  const { checkProjectPermissions } = useProjectOperations();

  const {
    addMember,
    removeMember,
    updateMemberRole,
    parseError,
    isLoading: memberOperationLoading,
  } = useMemberOperations();

  // Buscar projeto e verificar permissões
  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      try {
        const { hasPermission, project: fetchedProject } =
          await checkProjectPermissions(projectId, "edit");

        if (!fetchedProject) {
          navigateTo("/dashboard");
          return;
        }

        if (!hasPermission) {
          navigateTo(`/projects/${projectId}`);
          return;
        }

        setProject(fetchedProject);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        navigateTo("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, checkProjectPermissions, navigateTo]);

  // Wrapper para handleInputChange que aceita (field, value)
  const handleInputChange = useCallback(
    (field: keyof MemberFormData, value: string) => {
      updateFormData(field, value);
    },
    [updateFormData],
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      updateFormData("role", value);
    },
    [updateFormData],
  );

  const handleAddMember = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!project) {
        setGeneralError("Projeto não encontrado");
        return;
      }

      setFormLoading(true);
      resetErrors();

      try {
        const newMember = await addMember(
          project.id,
          formData,
          project.members || [],
        );

        setProject((prev) =>
          prev
            ? {
                ...prev,
                members: [...(prev.members || []), newMember],
              }
            : null,
        );

        resetForm();
      } catch (error: any) {
        console.error("Erro ao adicionar membro:", error);

        if (error.name === "ZodError") {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            if (err.path[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          const errorMessage = parseError(error);
          if (
            errorMessage.includes("não encontrado") ||
            errorMessage.includes("já é membro")
          ) {
            setErrors({ email: errorMessage });
          } else {
            setGeneralError(errorMessage);
          }
        }
      } finally {
        setFormLoading(false);
      }
    },
    [
      project,
      formData,
      setFormLoading,
      resetErrors,
      addMember,
      setErrors,
      setGeneralError,
      parseError,
      resetForm,
    ],
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!project) return;

      try {
        const updatedMembers = await removeMember(
          project.id,
          memberId,
          project.members || [],
        );

        setProject((prev) =>
          prev ? { ...prev, members: updatedMembers } : null,
        );
      } catch (error) {
        console.error("Erro ao remover membro:", error);
        setGeneralError("Erro ao remover membro");
      }
    },
    [project, removeMember, setGeneralError],
  );

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, newRole: string) => {
      if (!project) return;

      try {
        const updatedMembers = await updateMemberRole(
          project.id,
          memberId,
          newRole,
          project.members || [],
        );

        setProject((prev) =>
          prev ? { ...prev, members: updatedMembers } : null,
        );
      } catch (error) {
        console.error("Erro ao atualizar papel:", error);
        setGeneralError("Erro ao atualizar papel do membro");
      }
    },
    [project, updateMemberRole, setGeneralError],
  );

  // Navegação
  const navigateToProject = useCallback(() => {
    if (project) {
      navigateTo(`/projects/${project.id}`);
    }
  }, [project, navigateTo]);

  const navigateToDashboard = useCallback(() => {
    navigateTo("/dashboard");
  }, [navigateTo]);

  return {
    // Estado
    project,
    formData,
    errors,
    generalError,
    loading,
    isLoading: formLoading || memberOperationLoading,

    // Ações do formulário - agora com tipagem correta
    handleInputChange, // (field: keyof MemberFormData, value: string) => void
    handleRoleChange,
    handleAddMember,

    // Ações de membros
    handleRemoveMember,
    handleUpdateMemberRole,

    // Navegação
    navigateToProject,
    navigateToDashboard,
  };
}
