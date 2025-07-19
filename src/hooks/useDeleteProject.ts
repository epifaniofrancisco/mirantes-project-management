import { useState, useCallback } from "react";
import { ProjectService } from "@/services/projectService";

export function useDeleteProject() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProject = useCallback(
    async (
      projectId: string,
      onSuccess?: () => void,
      onError?: (error: string) => void,
    ) => {
      try {
        setIsDeleting(true);
        await ProjectService.deleteProject(projectId);
        onSuccess?.();
      } catch (error: any) {
        console.error("Erro ao deletar projeto:", error);
        const errorMessage = ProjectService.parseDeleteProjectError(error);
        onError?.(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  return {
    deleteProject,
    isDeleting,
  };
}
