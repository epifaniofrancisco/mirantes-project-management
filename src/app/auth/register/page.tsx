"use client";

import type React from "react";
import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { AuthLink } from "@/components/auth/AuthLink";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { useBaseForm } from "@/hooks/useBaseForm";
import { RegistrationService } from "@/services/registrationService";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import type { RegisterFormData } from "@/lib/types";

const INITIAL_REGISTER_DATA: RegisterFormData = {
  name: "",
  email: "",
  password: "",
};

export default function RegisterPage(): React.ReactElement {
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    navigateTo,
  } = useBaseForm(INITIAL_REGISTER_DATA);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      resetErrors();

      try {
        const validation = await RegistrationService.validateFormData(
          state.formData,
        );

        if (!validation.success && validation.errors) {
          setErrors(validation.errors);
          return;
        }

        await RegistrationService.createUser(state.formData);
        navigateTo("/dashboard");
      } catch (error: any) {
        console.error("Registration error:", error);

        const parsedError = RegistrationService.parseFirebaseError(error);

        if (parsedError.type === "field" && parsedError.field) {
          setErrors({ [parsedError.field]: parsedError.message });
        } else {
          setGeneralError(parsedError.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      state.formData,
      setLoading,
      resetErrors,
      setErrors,
      setGeneralError,
      navigateTo,
    ],
  );

  const handleNavigateToLogin = useCallback(() => {
    navigateTo("/auth/login");
  }, [navigateTo]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="name"
              label="Nome Completo"
              type="text"
              placeholder="Seu nome completo"
              value={state.formData.name}
              error={state.errors.name}
              isLoading={state.isLoading}
              icon={User}
              onChange={updateFormData}
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={state.formData.email}
              error={state.errors.email}
              isLoading={state.isLoading}
              icon={Mail}
              onChange={updateFormData}
            />

            <FormField
              id="password"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={state.formData.password}
              error={state.errors.password}
              isLoading={state.isLoading}
              icon={Lock}
              onChange={updateFormData}
            />

            {state.generalError && <ErrorAlert message={state.generalError} />}

            <LoadingButton
              loadingText="Criando conta..."
              defaultText="Criar Conta"
              isLoading={state.isLoading}
            />
          </form>

          <AuthLink
            questionText="Já tem uma conta?"
            linkText="Fazer login"
            onNavigate={handleNavigateToLogin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
