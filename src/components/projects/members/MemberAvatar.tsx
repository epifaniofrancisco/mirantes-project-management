import type React from "react";
import { UserAvatar } from "@/components/base/UserAvatar";
import type { ProjectMember, AvatarSize, User } from "@/lib/types";

interface MemberAvatarProps {
  member: ProjectMember;
  size?: AvatarSize;
  className?: string;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  member,
  size = "md",
  className = "",
}) => {
  const userForAvatar: User = {
    id: member.userId,
    name: member.name || member.email.split("@")[0],
    email: member.email,
    createdAt: member.addedAt || new Date().toISOString(),
  };

  return (
    <UserAvatar
      user={userForAvatar}
      size={size}
      className={className}
    />
  );
};