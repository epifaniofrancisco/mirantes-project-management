import { useCallback } from "react";
import { ProjectFormData } from "@/lib/types";
import { useBaseForm } from "../useBaseForm";
import { useProjectOperations } from "./useProjectOperations";

const INITIAL_FORM_DATA: ProjectFormData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
};

export function useCreateProject() {
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    navigateTo,
    navigateBack,
    handleInputChange,
  } = useBaseForm(INITIAL_FORM_DATA);

  const { createProject, validateProjectData, parseError, currentUser } =
    useProjectOperations();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentUser) {
        setGeneralError("Você precisa estar logado para criar um projeto");
        return;
      }

      setLoading(true);
      resetErrors();

      try {
        const validation = await validateProjectData(state.formData);
        if (!validation.success && validation.errors) {
          setErrors(validation.errors);
          return;
        }

        const projectId = await createProject(state.formData);
        navigateTo(`/projects/${projectId}`);
      } catch (error: any) {
        console.error("Erro ao criar projeto:", error);
        const errorMessage = parseError(error, "create");
        setGeneralError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      state.formData,
      currentUser,
      setLoading,
      resetErrors,
      setErrors,
      setGeneralError,
      navigateTo,
      validateProjectData,
      createProject,
      parseError,
    ],
  );

  return {
    state,
    updateFormData,
    handleInputChange,
    handleSubmit,
    navigateBack,
  };
}
