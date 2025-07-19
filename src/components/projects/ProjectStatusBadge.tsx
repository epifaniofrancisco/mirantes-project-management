import type React from "react";
import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS_CONFIG } from "@/constants/project";
import type { ProjectStatus } from "@/lib/types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
}) => {
  const config =
    PROJECT_STATUS_CONFIG[status] || PROJECT_STATUS_CONFIG.planning;

  return <Badge className={config.className}>{config.label}</Badge>;
};
