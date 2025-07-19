import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SIZE_CONFIG, type AvatarSize, type User } from "@/lib/types";
import {
  getInitials,
  getAvatarColor,
} from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  size?: AvatarSize;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className = "",
}) => {
  const sizeClasses = SIZE_CONFIG[size];
  const initials = getInitials(user.name, user.email);
  const colorClass = getAvatarColor(user.id);

  return (
    <Avatar className={`${sizeClasses} ${className}`}>
      <AvatarFallback
        className={`font-medium text-white ${colorClass}`}
        title={`${user.name} (${user.email})`}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
