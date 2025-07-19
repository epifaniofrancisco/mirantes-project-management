import type React from "react";
import { ProjectFormFields } from "./ProjectFormFields";
import { StatusSelect } from "./StatusSelect";
import type { ProjectFormData } from "@/lib/types";

interface FormData extends ProjectFormData {
  status: string;
}

interface EditProjectFormProps {
  formData: FormData;
  errors: Record<string, string>;
  isLoading: boolean;
  onUpdateField: (name: string, value: string) => void;
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({
  formData,
  errors,
  isLoading,
  onUpdateField,
}) => {
  const { status, ...baseFormData } = formData;

  const handleFieldUpdate = (field: keyof ProjectFormData, value: string) => {
    onUpdateField(field, value);
  };

  const handleStatusChange = (value: string) => {
    onUpdateField("status", value);
  };

  return (
    <div className="space-y-6">
      <ProjectFormFields
        formData={baseFormData}
        errors={errors}
        isLoading={isLoading}
        updateFormData={handleFieldUpdate}
      />

      <StatusSelect
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading}
      />
    </div>
  );
};
