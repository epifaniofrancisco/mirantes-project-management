"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { AuthLink } from "@/components/auth/AuthLink";
import { useCallback } from "react";
import { FormField } from "@/components/base/FormField";
import { LoadingButton } from "@/components/base/LoadingButton";
import { useBaseForm } from "@/hooks/useBaseForm";
import { LoginService } from "@/services/loginService";
import type { LoginFormData } from "@/lib/types";
import { ErrorAlert } from "@/components/base/ErrorAlert";

const INITIAL_LOGIN_DATA: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginPage(): React.ReactElement {
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    navigateTo,
  } = useBaseForm(INITIAL_LOGIN_DATA);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      resetErrors();

      try {
        const validation = await LoginService.validateFormData(state.formData);

        if (!validation.success && validation.errors) {
          setErrors(validation.errors);
          return;
        }

        await LoginService.signInUser(state.formData);
        navigateTo("/dashboard");
      } catch (error: any) {
        console.error("Login error:", error);

        const parsedError = LoginService.parseFirebaseError(error);

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

  const handleNavigateToRegister = useCallback(() => {
    navigateTo("/auth/register");
  }, [navigateTo]);

  const handleForgotPassword = useCallback(() => {
    navigateTo("/auth/forgot-password");
  }, [navigateTo]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="cursor-pointer text-xs text-blue-500 transition-colors hover:text-blue-600 focus:underline focus:outline-none"
              >
                Esqueceu a senha?
              </button>
            </div>

            {state.generalError && <ErrorAlert message={state.generalError} />}

            <LoadingButton
              isLoading={state.isLoading}
              loadingText="Carregando..."
              defaultText="Entrar"
            />
          </form>

          <AuthLink
            questionText="Não tem uma conta?"
            linkText="Crie uma agora"
            onNavigate={handleNavigateToRegister}
          />
        </CardContent>
      </Card>
    </div>
  );
}
