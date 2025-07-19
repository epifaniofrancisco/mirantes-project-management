import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectCardActions } from "./ProjectCardActions";
import { formatDateRange } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { ProjectMembersAvatars } from "./ProjectMembersAvatars";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const membersCount = project.members?.length || 0;
  const hasMembers = membersCount > 0;

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1 text-lg">
              {project.title}
            </CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
          <ProjectCardActions
            projectId={project.id}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="mb-2 line-clamp-2 text-gray-600">{project.description}</p>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateRange(project.startDate, project.endDate)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-2 h-4 w-4" />
              {membersCount} membros
            </div>

            {hasMembers && <ProjectMembersAvatars members={project.members} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
