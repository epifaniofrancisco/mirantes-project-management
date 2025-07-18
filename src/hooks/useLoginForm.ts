import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LoginFormData, FormErrors } from "@/lib/types";

export interface LoginState {
  formData: LoginFormData;
  errors: FormErrors;
  isLoading: boolean;
  generalError: string;
}

const INITIAL_FORM_DATA: LoginFormData = {
  email: "",
  password: "",
};

const INITIAL_STATE: LoginState = {
  formData: INITIAL_FORM_DATA,
  errors: {},
  isLoading: false,
  generalError: "",
};

export const useLoginForm = () => {
  const [state, setState] = useState<LoginState>(INITIAL_STATE);
  const router = useRouter();

  const updateFormData = useCallback(
    (field: keyof LoginFormData, value: string) => {
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
