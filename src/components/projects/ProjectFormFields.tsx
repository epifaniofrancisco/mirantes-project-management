import React from "react";
import { FileText, Calendar } from "lucide-react";
import type { ProjectFormData, FormErrors } from "@/lib/types";
import { FormField } from "../base/FormField";

interface ProjectFormFieldsProps {
  formData: ProjectFormData;
  errors: FormErrors;
  isLoading: boolean;
  updateFormData: (field: keyof ProjectFormData, value: string) => void;
}

export interface ProjectFieldConfig {
  id: keyof ProjectFormData;
  label: string;
  type: "text" | "textarea" | "date";
  placeholder: string;
  required: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  gridColumn?: string;
}

export const PROJECT_FORM_FIELDS: ProjectFieldConfig[] = [
  {
    id: "title",
    label: "Título do Projeto",
    type: "text",
    placeholder: "Ex: Desenvolvimento do App Mobile",
    required: true,
    icon: FileText,
  },
  {
    id: "description",
    label: "Descrição",
    type: "textarea",
    placeholder: "Descreva os objetivos e escopo do projeto...",
    required: true,
  },
  {
    id: "startDate",
    label: "Data de Início",
    type: "date",
    placeholder: "",
    required: true,
    icon: Calendar,
    gridColumn: "md:col-span-1",
  },
  {
    id: "endDate",
    label: "Data de Fim",
    type: "date",
    placeholder: "",
    required: true,
    icon: Calendar,
    gridColumn: "md:col-span-1",
  },
] as const;

export const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({
  formData,
  errors,
  isLoading,
  updateFormData,
}) => {
  return (
    <div className="space-y-6">
      {PROJECT_FORM_FIELDS.map((field) => {
        if (field.gridColumn) {
          const dateFields = PROJECT_FORM_FIELDS.filter((f) => f.gridColumn);
          const isFirstDateField = field.id === dateFields[0].id;

          if (isFirstDateField) {
            return (
              <div
                key="date-fields"
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {dateFields.map((dateField) => (
                  <FormField
                    key={dateField.id}
                    id={dateField.id}
                    label={dateField.label}
                    type={dateField.type}
                    placeholder={dateField.placeholder}
                    value={formData[dateField.id]}
                    error={errors[dateField.id]}
                    isLoading={isLoading}
                    required={dateField.required}
                    icon={dateField.icon}
                    onChange={updateFormData}
                  />
                ))}
              </div>
            );
          }
          return null;
        }

        return (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id]}
            error={errors[field.id]}
            isLoading={isLoading}
            required={field.required}
            icon={field.icon}
            onChange={updateFormData}
          />
        );
      })}
    </div>
  );
};
