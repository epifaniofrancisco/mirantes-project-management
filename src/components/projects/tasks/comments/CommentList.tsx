"use client";

import { useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { useCommentOperations } from "@/hooks/projects/tasks/useCommentOperations";
import { MessageCircle } from "lucide-react";
import type { Comment, Task, Project } from "@/lib/types";
import LoadingSpinner from "@/components/base/LoadingSpinner";

interface CommentsListProps {
  task: Task;
  project: Project;
}

export function CommentsList({ task, project }: Readonly<CommentsListProps>) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    createComment,
    updateComment,
    deleteComment,
    listenToComments,
    isLoading,
  } = useCommentOperations();

  // Listener para comentários
  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToComments(task.id, (commentsData) => {
      setComments(commentsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [task.id, listenToComments]);

  const handleCreateComment = async (content: string) => {
    await createComment(
      { content },
      task.id,
      task.projectId || project.id,
      project,
    );
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 p-4">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              isLoading={isLoading}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="mb-1 font-medium">Nenhum comentário ainda</p>
          <p className="text-sm">Seja o primeiro a comentar nesta tarefa!</p>
        </div>
      )}

      <CommentForm
        project={project}
        onSubmit={handleCreateComment}
        isLoading={isLoading}
      />
    </div>
  );
}
