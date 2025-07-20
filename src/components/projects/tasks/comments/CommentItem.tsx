"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MemberAvatar } from "@/components/projects/members/MemberAvatar";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type { Comment } from "@/lib/types";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentItem({
  comment,
  onUpdate,
  onDelete,
  isLoading = false,
}: Readonly<CommentItemProps>) {
  const [user] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwner = user?.uid === comment.createdBy;
  const canEdit = isOwner && !isLoading;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      handleCancelEdit();
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }

    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
    }
  };

  // Mock member object para MemberAvatar
  const memberData = {
    userId: comment.createdBy,
    name: comment.createdByName,
    email: comment.createdByName, // fallback
    avatar: comment.createdByAvatar,
    role: "member" as const,
    joinedAt: comment.createdAt,
  };

  return (
    <div className="flex gap-3 border-b border-gray-100 p-4 last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <MemberAvatar member={memberData} size="sm" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <span className="truncate font-medium text-gray-900">
            {comment.createdByName}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {comment.edited && (
            <span className="text-xs text-gray-400">(editado)</span>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] resize-none"
              placeholder="Escreva seu comentário..."
              disabled={isUpdating}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isUpdating || !editContent.trim()}
                className="h-8"
              >
                <Check className="mr-1 h-3 w-3" />
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-8"
              >
                <X className="mr-1 h-3 w-3" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="group">
            <p className="break-words whitespace-pre-wrap text-gray-700">
              {comment.content}
            </p>

            {/* Actions */}
            {canEdit && (
              <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStartEdit}
                  className="h-6 px-2 text-xs"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Excluir
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
