"use client";

import type React from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { useMembersPage } from "@/hooks/projects/members/useMemberPage";
import { AddMemberForm } from "@/components/projects/members/AddMemberForm";
import { MembersListWithRole } from "@/components/projects/members/MembersListWithRole"

interface MembersPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MembersPage({ params }: Readonly<MembersPageProps>) {
  const resolvedParams = use(params);

  const {
    project,
    formData,
    errors,
    generalError,
    loading,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    navigateToProject,
    navigateToDashboard,
  } = useMembersPage({ projectId: resolvedParams.id });

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
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToProject}
              className="flex items-center gap-2 self-start sm:shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">Voltar</span>
            </Button>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                Gerenciar Membros
              </h1>
              <p className="mt-1 truncate text-sm text-gray-600 sm:text-base">
                {project.title}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Add Member Form */}
          <AddMemberForm
            formData={formData}
            errors={errors}
            generalError={generalError}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onRoleChange={handleRoleChange}
            onSubmit={handleAddMember}
          />

          {/* Current Members */}
          <MembersListWithRole
            members={project.members || []}
            onUpdateRole={handleUpdateMemberRole}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>
    </div>
  );
}
