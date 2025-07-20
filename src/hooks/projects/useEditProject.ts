import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectFormData } from "@/lib/types";
import { useBaseForm } from "@/hooks/useBaseForm";
import { useProjectOperations } from "@/hooks/projects/useProjectOperations";

interface UseEditProjectProps {
  projectId: string;
}

interface FormState extends ProjectFormData {
  status: string;
}

const initialFormData: FormState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "planning",
};

export function useEditProject({ projectId }: UseEditProjectProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    state: { formData, errors, isLoading, generalError },
    updateFormData,
    updateMultipleFields,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    navigateTo,
    handleInputChange,
    handleSelectChange,
  } = useBaseForm<FormState>(initialFormData);

  const { checkProjectPermissions, updateProject, parseError } =
    useProjectOperations();

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

        updateMultipleFields({
          title: fetchedProject.title,
          description: fetchedProject.description,
          startDate: fetchedProject.startDate,
          endDate: fetchedProject.endDate,
          status: fetchedProject.status,
        });
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        navigateTo("/dashboard");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProject();
  }, [projectId, checkProjectPermissions, navigateTo, updateMultipleFields]);

  const updateField = useCallback(
    (name: string, value: string) => {
      updateFormData(name as keyof FormState, value);
    },
    [updateFormData],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!project) {
        setGeneralError("Projeto não encontrado");
        return;
      }

      setLoading(true);
      resetErrors();

      try {
        await updateProject(project.id, formData);
        navigateTo(`/projects/${project.id}`);
      } catch (error: any) {
        console.error("Erro ao atualizar projeto:", error);

        if (error.name === "ZodError") {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            if (err.path[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          const errorMessage = parseError(error, "update");
          setGeneralError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      project,
      formData,
      setLoading,
      resetErrors,
      setErrors,
      setGeneralError,
      navigateTo,
      updateProject,
      parseError,
    ],
  );

  const navigateToProject = useCallback(() => {
    if (project) {
      navigateTo(`/projects/${project.id}`);
    }
  }, [project, navigateTo]);

  const navigateToDashboard = useCallback(() => {
    navigateTo("/dashboard");
  }, [navigateTo]);

  return {
    project,
    formData,
    errors,
    isLoading,
    generalError,
    loading: initialLoading,

    updateField,
    handleInputChange,
    handleSelectChange: handleSelectChange("status"),
    handleSubmit,

    navigateToProject,
    navigateToDashboard,
  };
}
