import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

interface BaseFormFieldProps<T = string> {
  id: T;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  isLoading: boolean;
  required?: boolean;
  onChange: (field: T, value: string) => void;
}

interface InputFormFieldProps<T = string> extends BaseFormFieldProps<T> {
  type: "text" | "email" | "password" | "date" | "textarea";
  icon?: React.ComponentType<{ className?: string }>;
}

export const FormField = <T extends string>({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  isLoading = false,
  required = false,
  icon: Icon,
  onChange,
}: InputFormFieldProps<T>): React.ReactElement => {
  const inputClassName = `${error ? "border-red-500" : ""} ${Icon ? "pl-10" : ""}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
        )}
        {type === "textarea" ? (
          <Textarea
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            className={`min-h-[100px] ${error ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
        ) : (
          <Input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            className={inputClassName}
            disabled={isLoading}
          />
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
