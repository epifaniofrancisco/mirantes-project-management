"use client";

import type React from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useEditProject } from "@/hooks/projects/useEditProject";
import { EditProjectForm } from "@/components/projects/EditProjectForm";
import LoadingSpinner from "@/components/base/LoadingSpinner";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProjectPage({ params }: Readonly<EditProjectPageProps>) {
  const resolvedParams = use(params);

  const {
    project,
    formData,
    errors,
    isLoading,
    generalError,
    loading,
    updateField,
    handleSubmit,
    navigateToProject,
    navigateToDashboard,
  } = useEditProject({ projectId: resolvedParams.id });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
          <Button onClick={navigateToDashboard} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToProject}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Projeto</h1>
            <p className="text-gray-600">Atualize as informações do projeto</p>
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
            <CardDescription>
              Edite as informações do seu projeto
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <EditProjectForm
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onUpdateField={updateField}
              />

              {/* Erro Geral */}
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={navigateToProject}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
