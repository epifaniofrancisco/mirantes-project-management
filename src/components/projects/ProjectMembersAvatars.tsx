import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ProjectMember } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils";

interface ProjectMembersAvatarsProps {
  members: ProjectMember[];
  maxVisible?: number;
}

export const ProjectMembersAvatars: React.FC<ProjectMembersAvatarsProps> = ({
  members,
  maxVisible = 3,
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <div className="flex -space-x-2">
      {visibleMembers.map((member, index) => {
        const identifier = member.userId || member.email;
        const initials = getInitials(member.name, member.email);
        const colorClass = getAvatarColor(identifier);

        return (
          <Avatar
            key={member.userId || index}
            className="h-6 w-6 border-2 border-white"
          >
            <AvatarFallback
              className={`text-xs text-white ${colorClass}`}
              title={`${member.name} (${member.email})`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {extraCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100">
          <span className="text-xs text-gray-600">+{extraCount}</span>
        </div>
      )}
    </div>
  );
};
