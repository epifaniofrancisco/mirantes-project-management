import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FormErrors } from "@/lib/types";

export interface BaseFormState<T> {
  formData: T;
  errors: FormErrors;
  isLoading: boolean;
  generalError: string;
}

export const useBaseForm = <T extends Record<string, any>>(
  initialFormData: T,
) => {
  const router = useRouter();

  const [state, setState] = useState<BaseFormState<T>>({
    formData: initialFormData,
    errors: {},
    isLoading: false,
    generalError: "",
  });

  const updateFormData = useCallback((field: keyof T, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      errors: { ...prev.errors, [field]: "" },
    }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
    }));
  }, []);

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

  const resetForm = useCallback(() => {
    setState({
      formData: initialFormData,
      errors: {},
      isLoading: false,
      generalError: "",
    });
  }, [initialFormData]);

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      updateFormData(name as keyof T, value);
    },
    [updateFormData],
  );

  const handleSelectChange = useCallback(
    (field: keyof T) => (value: string) => {
      updateFormData(field, value);
    },
    [updateFormData],
  );

  return {
    state,
    updateFormData,
    updateMultipleFields,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    resetForm,
    navigateBack,
    navigateTo,
    router,
    handleInputChange,
    handleSelectChange,
  };
};
