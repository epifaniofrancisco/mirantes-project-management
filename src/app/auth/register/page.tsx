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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, AlertCircle } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { AuthLink } from "@/components/auth/AuthLink";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { RegistrationService } from "@/services/registrationService";

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default function RegisterPage(): React.ReactElement {
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    router,
  } = useRegistrationForm();

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

        router.push("/dashboard");
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
      router,
    ],
  );

  const handleNavigateToLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

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
