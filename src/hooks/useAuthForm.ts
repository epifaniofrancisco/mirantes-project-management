import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LoginFormData, FormErrors } from "@/lib/types";

export interface AuthFormState<T> {
  formData: T;
  errors: FormErrors;
  isLoading: boolean;
  generalError: string;
}

export const useAuthForm = <T extends Record<string, any>>(
  initialFormData: T,
) => {
  const router = useRouter();

  const INITIAL_STATE: AuthFormState<T> = {
    formData: initialFormData,
    errors: {},
    isLoading: false,
    generalError: "",
  };

  const [state, setState] = useState<AuthFormState<T>>(INITIAL_STATE);

  const updateFormData = useCallback(
    (field: keyof T, value: string) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, [field]: value },
        errors: { ...prev.errors, [field]: "" }, // Clear field error on change
      }));
    },
    [],
  );

  const setErrors = useCallback((errors: FormErrors) => {
    setState((prev) => ({ ...prev, errors }));
  }, []);

  const setGeneralError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, generalError: error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const resetErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: {}, generalError: "" }));
  }, []);

  return {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    router,
  };
};
