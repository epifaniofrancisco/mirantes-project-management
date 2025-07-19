import type React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

export const STATUS_OPTIONS = [
  { value: "planning", label: "Planejamento" },
  { value: "active", label: "Ativo" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
] as const;

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
  label = "Status do Projeto",
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
