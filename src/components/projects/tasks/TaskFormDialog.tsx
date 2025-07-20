"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Calendar, FileText } from "lucide-react";
import { useTaskOperations } from "@/hooks/projects/tasks/useTaskOperations";
import type { Task, Project, TaskFormData } from "@/lib/types";
import { LoadingButton } from "@/components/base/LoadingButton";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import { FormField } from "@/components/base/FormField";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  mode: "create" | "edit";
  task?: Task;
  projectId?: string;
}

const INITIAL_FORM_DATA: TaskFormData & { newTag: string } = {
  title: "",
  description: "",
  status: "pending",
  assignedTo: "",
  dueDate: "",
  priority: "medium",
  tags: [],
  newTag: "",
};

export function TaskFormDialog({
  open,
  onOpenChange,
  project,
  mode,
  task,
  projectId,
}: Readonly<TaskFormDialogProps>) {
  const [formData, setFormData] = useState<TaskFormData & { newTag: string }>(
    INITIAL_FORM_DATA,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const { createTask, updateTask, isLoading, parseTaskError } =
    useTaskOperations();

  const isEditMode = mode === "edit";
  const dialogTitle = isEditMode ? "Editar Tarefa" : "Nova Tarefa";
  const dialogDescription = isEditMode
    ? `Atualize as informações da tarefa "${task?.title}"`
    : `Crie uma nova tarefa para o projeto ${project.title}`;
  const submitButtonText = isEditMode ? "Salvar Alterações" : "Criar Tarefa";
  const loadingText = isEditMode ? "Salvando..." : "Criando...";

  useEffect(() => {
    if (isEditMode && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "medium",
        tags: task.tags || [],
        newTag: "",
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [isEditMode, task, open]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setGeneralError("");
    }
  }, [open]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGeneralError("");
    setErrors({});

    try {
      const { newTag, ...taskData } = formData;

      if (taskData.assignedTo === "none" || taskData.assignedTo === "") {
        taskData.assignedTo = undefined;
      }

      if (isEditMode && task) {
        await updateTask(task.id, taskData, project);
      } else if (projectId) {
        await createTask(taskData, projectId, project);
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error(
        `Erro ao ${isEditMode ? "atualizar" : "criar"} tarefa:`,
        error,
      );

      if (error?.name === "ZodError") {
        const fieldErrors: Record<string, string> = {};
        error.errors?.forEach((err: any) => {
          if (err.path?.[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        const errorMessage = parseTaskError(error);
        setGeneralError(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-2 my-4 max-h-[95vh] w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto p-4 sm:mx-4 sm:my-8 sm:p-6 lg:max-w-3xl">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <FileText className="h-5 w-5" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormField
            id="title"
            label="Título"
            type="text"
            placeholder="Ex: Implementar sistema de login"
            value={formData.title}
            error={errors.title}
            isLoading={isLoading}
            required
            onChange={handleFieldChange}
          />

          {/* Description Field */}
          <FormField
            id="description"
            label="Descrição"
            type="textarea"
            placeholder="Descreva os detalhes da tarefa..."
            value={formData.description}
            error={errors.description}
            isLoading={isLoading}
            onChange={handleFieldChange}
          />

          {/* Status and Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Status Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Status <span className="ml-1 text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`${errors.status ? "border-red-500" : ""}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>

            {/* Priority Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`${errors.priority ? "border-red-500" : ""}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Baixa</SelectItem>
                  <SelectItem value="medium">🟡 Média</SelectItem>
                  <SelectItem value="high">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Assigned To and Due Date */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Assigned To Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Responsável</Label>
              <Select
                value={formData.assignedTo || "none"}
                onValueChange={(value) =>
                  handleSelectChange("assignedTo", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`${errors.assignedTo ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {project.members?.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {member.name || member.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-sm text-red-500">{errors.assignedTo}</p>
              )}
            </div>

            {/* Due Date Field */}
            <FormField
              id="dueDate"
              label="Data de Vencimento"
              type="date"
              placeholder=""
              value={formData.dueDate || ""}
              error={errors.dueDate}
              isLoading={isLoading}
              onChange={handleFieldChange}
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Etiquetas</Label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <FormField
                  id="newTag"
                  label=""
                  type="text"
                  placeholder="Digite uma etiqueta e pressione Enter"
                  value={formData.newTag}
                  isLoading={isLoading}
                  onChange={handleFieldChange}
                />
              </div>
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                disabled={isLoading || !formData.newTag.trim()}
                className="h-10 w-full whitespace-nowrap sm:w-auto sm:px-4"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="sm:inline">Adicionar</span>
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-1 text-xs"
                  >
                    <span className="max-w-[120px] truncate sm:max-w-none">
                      {tag}
                    </span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* General Error */}
          {generalError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <ErrorAlert message={generalError} />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-10 w-full sm:w-auto sm:min-w-[100px]"
            >
              Cancelar
            </Button>
            <LoadingButton
              isLoading={isLoading}
              loadingText={loadingText}
              defaultText={submitButtonText}
              className="h-10 w-full sm:w-auto sm:min-w-[120px]"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
