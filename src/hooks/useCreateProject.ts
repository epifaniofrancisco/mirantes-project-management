import { useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { ProjectService } from "@/services/projectService";
import { ProjectFormData } from "@/lib/types";
import { useBaseForm } from "./useBaseForm";

const INITIAL_FORM_DATA: ProjectFormData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
};

export function useCreateProject() {
  const [user] = useAuthState(auth);
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    navigateTo,
    navigateBack,
  } = useBaseForm(INITIAL_FORM_DATA);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        setGeneralError("Você precisa estar logado para criar um projeto");
        return;
      }

      setLoading(true);
      resetErrors();

      try {
        const validation = await ProjectService.validateFormData(
          state.formData,
        );

        if (!validation.success && validation.errors) {
          setErrors(validation.errors);
          return;
        }

        const projectId = await ProjectService.createProject(
          state.formData,
          user.uid,
        );

        navigateTo(`/projects/${projectId}`);
      } catch (error: any) {
        console.error("Erro ao criar projeto:", error);
        const errorMessage = ProjectService.parseCreateProjectError(error);
        setGeneralError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      state.formData,
      user,
      setLoading,
      resetErrors,
      setErrors,
      setGeneralError,
      navigateTo,
    ],
  );

  return {
    state,
    updateFormData,
    handleSubmit,
    navigateBack,
  };
}
