import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/lib/types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CONFIG = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

const getInitials = (name: string, email: string): string => {
  if (name && name.trim()) {
    return name
      .trim()
      .split(" ")
      .slice(0, 2) // Máximo 2 palavras
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  // Se não tem nome, usa as primeiras 2 letras do email
  return email.slice(0, 2).toUpperCase();
};

const getAvatarColor = (identifier: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const index =
    identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};

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
