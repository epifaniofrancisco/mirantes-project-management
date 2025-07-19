import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { formatDate } from "@/lib/utils";
import type { ProjectMember } from "@/lib/types";

interface MembersListProps {
  members: ProjectMember[];
  onUpdateRole: (memberId: string, newRole: string) => void;
  onRemoveMember: (memberId: string) => void;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Membro" },
  { value: "viewer", label: "Viewer" },
] as const;

export const MembersListWithRole: React.FC<MembersListProps> = ({
  members,
  onUpdateRole,
  onRemoveMember,
}) => {
  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membros Atuais (0)</CardTitle>
          <CardDescription>
            Gerencie os membros existentes do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">
            Nenhum membro adicionado ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros Atuais ({members.length})</CardTitle>
        <CardDescription>
          Gerencie os membros existentes do projeto
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex flex-col gap-4 rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <MemberAvatar member={member} size="md" />
                <div>
                  <h3 className="font-medium">{member.name || member.email}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    Adicionado em {formatDate(member.addedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={member.role}
                  onValueChange={(value) => onUpdateRole(member.userId, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.userId)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
