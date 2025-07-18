import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { RegisterFormData } from "@/lib/types";

interface FormErrors {
  [key: string]: string;
}

interface RegistrationState {
  formData: RegisterFormData;
  errors: FormErrors;
  isLoading: boolean;
  generalError: string;
}

const INITIAL_FORM_DATA: RegisterFormData = {
  name: "",
  email: "",
  password: "",
};

const INITIAL_STATE: RegistrationState = {
  formData: INITIAL_FORM_DATA,
  errors: {},
  isLoading: false,
  generalError: "",
};

export const useRegistrationForm = () => {
  const [state, setState] = useState<RegistrationState>(INITIAL_STATE);
  const router = useRouter();

  const updateFormData = useCallback(
    (field: keyof RegisterFormData, value: string) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, [field]: value },
        errors: { ...prev.errors, [field]: "" },
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