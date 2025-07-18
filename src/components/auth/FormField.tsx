import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterFormData } from "@/lib/types";

interface FormFieldProps {
  id: keyof RegisterFormData;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  isLoading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  isLoading,
  icon: Icon,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Icon className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className={`pl-10 ${error ? "border-red-500" : ""}`}
        disabled={isLoading}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
