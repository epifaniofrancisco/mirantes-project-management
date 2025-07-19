import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, UserPlus } from "lucide-react";
import type { MemberFormData } from "@/lib/types";
import { LoadingButton } from "@/components/base/LoadingButton";
import { ErrorAlert } from "@/components/base/ErrorAlert";
import { FormField } from "@/components/base/FormField";

interface AddMemberFormProps {
  formData: MemberFormData;
  errors: Record<string, string>;
  generalError: string;
  isLoading: boolean;
  onInputChange: (field: keyof MemberFormData, value: string) => void;
  onRoleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "Administrador",
    description: "pode editar projeto e gerenciar membros",
  },
  {
    value: "member",
    label: "Membro",
    description: "pode criar e editar tarefas",
  },
  {
    value: "viewer",
    label: "Visualizador",
    description: "apenas visualização",
  },
] as const;

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
  formData,
  errors,
  generalError,
  isLoading,
  onInputChange,
  onRoleChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Adicionar Membro
        </CardTitle>
        <CardDescription>
          Convide novos membros para colaborar no projeto
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            id="email"
            label="Email do Usuário"
            type="email"
            placeholder="usuario@exemplo.com"
            value={formData.email}
            error={errors.email}
            isLoading={isLoading}
            required={true}
            icon={Mail}
            onChange={onInputChange}
          />

          <div className="space-y-2">
            <Label htmlFor="role">Papel no Projeto</Label>
            <Select
              value={formData.role}
              onValueChange={onRoleChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o papel" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">
              {ROLE_OPTIONS.map((option, index) => (
                <div key={option.value}>
                  <strong>{option.label}:</strong> {option.description}
                  {index < ROLE_OPTIONS.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>

          {/* General Error */}
          {generalError && <ErrorAlert message={generalError} />}

          <LoadingButton
            isLoading={isLoading}
            loadingText="Adicionando..."
            defaultText="Adicionar Membro"
          />
        </form>
      </CardContent>
    </Card>
  );
};