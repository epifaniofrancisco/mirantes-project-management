"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateProject } from "@/hooks/projects/useCreateProject";
import { ProjectFormFields } from "@/components/projects/ProjectFormFields";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import { LoadingButton } from "@/components/base/LoadingButton";

export default function NewProjectPage() {
  const { state, updateFormData, handleSubmit, navigateBack } =
    useCreateProject();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 md:p-6">
      <div className="container mx-auto max-w-xs py-4 sm:max-w-md sm:py-6 md:max-w-2xl md:py-8 lg:max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-start"
            disabled={state.isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="w-full text-center sm:w-auto sm:text-left">
            <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
              Novo Projeto
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Crie um novo projeto para sua equipe
            </p>
          </div>
        </div>

        <Card className="shadow-sm sm:shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Informações do Projeto
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Preencha as informações básicas do seu projeto
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <ProjectFormFields
                formData={state.formData}
                errors={state.errors}
                isLoading={state.isLoading}
                updateFormData={updateFormData}
              />

              {state.generalError && (
                <ErrorAlert message={state.generalError} />
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={navigateBack}
                  disabled={state.isLoading}
                  className="order-2 w-full sm:order-1 sm:w-auto"
                >
                  Cancelar
                </Button>
                <LoadingButton
                  isLoading={state.isLoading}
                  loadingText="Criando..."
                  defaultText="Criar projeto"
                  className="order-1 w-full sm:order-2 sm:w-auto"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
