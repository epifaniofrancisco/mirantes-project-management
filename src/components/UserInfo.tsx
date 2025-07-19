import type React from "react";
import { UserAvatar } from "./base/UserAvatar";
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

interface UserInfoProps {
  user: User;
  projectsCount: number;
  layout?: "horizontal" | "vertical";
}

export const UserInfo: React.FC<UserInfoProps> = ({
  user,
  projectsCount,
  layout = "horizontal",
}) => {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`flex gap-4 ${isHorizontal ? "flex-col sm:flex-row sm:items-center sm:justify-between" : "flex-col items-center text-center"}`}
    >
      {/* Avatar e Informações do Usuário */}
      <div
        className={`flex gap-3 ${isHorizontal ? "items-center text-center sm:text-left" : "flex-col items-center"}`}
      >
        <UserAvatar user={user} size="lg" className="flex-shrink-0" />

        <div
          className={isHorizontal ? "text-center sm:text-left" : "text-center"}
        >
          <h2 className="text-lg font-semibold sm:text-xl">{user.name}</h2>
          <p className="text-sm text-slate-600 sm:text-base">{user.email}</p>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Membro desde {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Contador de Projetos */}
      <div
        className={`${isHorizontal ? "text-center sm:text-right" : "mt-4 text-center"}`}
      >
        <div className="text-xl font-bold text-blue-600 sm:text-2xl">
          {projectsCount}
        </div>
        <p className="text-xs text-gray-500 sm:text-sm">
          {projectsCount === 1 ? "Projeto" : "Projetos"}
        </p>
      </div>
    </div>
  );
};
