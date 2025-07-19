"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { FormField } from "@/components/base/FormField";
import { LoadingButton } from "@/components/base/LoadingButton";
import { ForgotPasswordService } from "@/services/forgotPasswordService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useBaseForm } from "@/hooks/useBaseForm";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import { Button } from "@/components/ui/button";

export const INITIAL_FORGOT_PASSWORD_DATA: { email: string } = {
  email: "",
};

export const useForgotPasswordForm = () => {
  const authForm = useBaseForm(INITIAL_FORGOT_PASSWORD_DATA);

  const [isSuccess, setIsSuccess] = useState(false);

  const setSuccess = useCallback((success: boolean) => {
    setIsSuccess(success);
  }, []);

  return {
    ...authForm,
    isSuccess,
    setSuccess,
  };
};

const SuccessMessage: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-900">
        Email enviado com sucesso!
      </h3>
      <div className="space-y-2">
        <p className="text-slate-600">Enviámos um link de recuperação para:</p>
        <p className="rounded bg-slate-50 px-3 py-2 font-medium text-slate-900">
          {email}
        </p>
        <p className="text-sm text-slate-500">
          Verifique sua caixa de entrada (e também a pasta de spam). O link
          expira em 1 hora.
        </p>
      </div>
    </div>
  );
};

export default function ForgotPasswordPage(): React.ReactElement {
  const {
    state,
    updateFormData,
    setErrors,
    setGeneralError,
    setLoading,
    resetErrors,
    isSuccess,
    setSuccess,
    router,
  } = useForgotPasswordForm();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!state.formData.email.trim()) {
        setErrors({ email: "Email é obrigatório" });
        return;
      }

      setLoading(true);
      resetErrors();

      try {
        const validation = await ForgotPasswordService.validateFormData(
          state.formData,
        );

        if (!validation.success && validation.errors) {
          setErrors(validation.errors);
          return;
        }

        await ForgotPasswordService.sendResetEmail(state.formData);
        setSuccess(true);
      } catch (error: any) {
        const parsedError = ForgotPasswordService.parseFirebaseError(error);

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
      setSuccess,
    ],
  );

  const handleBackToLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  const handleTryAgain = useCallback(() => {
    setSuccess(false);
    resetErrors();
  }, [setSuccess, resetErrors]);

  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="space-y-4">
          <SuccessMessage email={state.formData.email} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleTryAgain}
              className="flex-1"
            >
              Enviar novamente
            </Button>
            <Button onClick={handleBackToLogin} className="flex-1">
              Ir para login
            </Button>
          </div>
        </div>
      );
    }

    return (
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

        {state.generalError && <ErrorAlert message={state.generalError} />}

        <LoadingButton
          isLoading={state.isLoading}
          loadingText="Enviando..."
          defaultText="Enviar link de recuperação"
        />
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? "Email Enviado" : "Recuperar Senha"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "Verifique sua caixa de entrada"
              : "Digite seu email para receber um link de recuperação"}
          </CardDescription>
        </CardHeader>

        <CardContent>{renderContent()}</CardContent>

        {!isSuccess && (
          <CardFooter className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleBackToLogin}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
