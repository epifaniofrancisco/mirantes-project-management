"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MemberAvatar } from "@/components/projects/members/MemberAvatar";
import { LoadingButton } from "@/components/base/LoadingButton";
import { Send } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type { Project } from "@/lib/types";

interface CommentFormProps {
  project: Project;
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentForm({
  project,
  onSubmit,
  isLoading = false,
}: Readonly<CommentFormProps>) {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  // Encontrar dados do usuário no projeto
  const currentMember = project.members?.find(m => m.userId === user.uid) || {
    userId: user.uid,
    name: user.displayName || user.email || "Usuário",
    email: user.email || "",
    avatar: user.photoURL || undefined,
    role: "member" as const,
    joinedAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting || isLoading) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isLoading || !content.trim();

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex gap-3">
        {/* Avatar do usuário */}
        <div className="flex-shrink-0">
          <MemberAvatar 
            member={currentMember}
            size="sm"
          />
        </div>

        {/* Input area */}
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva um comentário..."
            className="min-h-[80px] resize-none"
            disabled={isSubmitting || isLoading}
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {content.length}/1000 caracteres
            </span>
            
            <LoadingButton
              isLoading={isSubmitting}
              loadingText="Enviando..."
              defaultText="Comentar"
              className="min-w-[100px]"
             />
          </div>
        </div>
      </div>
    </form>
  );
}