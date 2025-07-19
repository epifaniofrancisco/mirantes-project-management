import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import type { Project } from "@/lib/types";

interface MembersListProps {
  project: Project;
  isOwner: boolean;
  onAddMembers: () => void;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "owner":
      return "Proprietário";
    case "admin":
      return "Administrador";
    case "member":
      return "Membro";
    default:
      return "Visualizador";
  }
};

export const MembersList: React.FC<MembersListProps> = ({
  project,
  isOwner,
  onAddMembers,
}) => {
  if (!project.members || project.members.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-4 text-gray-500">Nenhum membro adicionado ainda</p>
          {isOwner && <Button onClick={onAddMembers}>Adicionar Membros</Button>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {project.members.map((member) => (
        <Card key={member.userId}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MemberAvatar member={member} size="md" />
              <div className="flex-1">
                <h3 className="font-medium">{member.name || member.email}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {getRoleLabel(member.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
