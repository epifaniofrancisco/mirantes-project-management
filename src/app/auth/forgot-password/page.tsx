"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { FormField } from "@/components/auth/FormField";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { ForgotPasswordService } from "@/services/forgotPasswordService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const INITIAL_FORGOT_PASSWORD_DATA: { email: string } = {
  email: "",
};

export const useForgotPasswordForm = () => {
  const authForm = useAuthForm(INITIAL_FORGOT_PASSWORD_DATA);

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

const EmailNotFoundMessage: React.FC<{
  email: string;
  onTryAgain: () => void;
  onGoToRegister: () => void;
}> = ({ email, onTryAgain, onGoToRegister }) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Email não encontrado</strong>
          <br />
          Não encontramos uma conta criada com o email{" "}
          <strong>{email}</strong>
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <p className="text-center text-sm text-slate-600">
          Verifique se digitou o email corretamente ou crie uma nova conta.
        </p>

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onTryAgain} className="w-full">
            Tentar outro email
          </Button>

          <Button onClick={onGoToRegister} className="w-full">
            Criar nova conta
          </Button>
        </div>
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

  const [showEmailNotFound, setShowEmailNotFound] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!state.formData.email.trim()) {
        setErrors({ email: "Email é obrigatório" });
        return;
      }

      setLoading(true);
      resetErrors();
      setShowEmailNotFound(false);

      try {
        console.log("Iniciando processo de recuperação de senha...");

        const validation = await ForgotPasswordService.validateFormData(
          state.formData,
        );

        if (!validation.success && validation.errors) {
          console.log("Erro de validação:", validation.errors);
          setErrors(validation.errors);
          return;
        }

        console.log("Validação passou, enviando email...");

        await ForgotPasswordService.sendResetEmail(state.formData);

        console.log("Email enviado com sucesso!");
        setSuccess(true);
      } catch (error: any) {
        console.error("Erro no processo de recuperação:", error);

        if (error.code === "auth/user-not-found") {
          setShowEmailNotFound(true);
          return;
        }

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
    setShowEmailNotFound(false);
    resetErrors();
  }, [setSuccess, resetErrors]);

  const handleGoToRegister = useCallback(() => {
    router.push("/auth/register");
  }, [router]);

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

    if (showEmailNotFound) {
      return (
        <EmailNotFoundMessage
          email={state.formData.email}
          onTryAgain={handleTryAgain}
          onGoToRegister={handleGoToRegister}
        />
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
          loadingText="Verificando..."
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
            {isSuccess
              ? "Email Enviado"
              : showEmailNotFound
                ? "Email Não Encontrado"
                : "Recuperar Senha"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "Verifique sua caixa de entrada"
              : showEmailNotFound
                ? "Este email não está registrado"
                : "Digite seu email para receber um link de recuperação"}
          </CardDescription>
        </CardHeader>

        <CardContent>{renderContent()}</CardContent>

        {!isSuccess && !showEmailNotFound && (
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
