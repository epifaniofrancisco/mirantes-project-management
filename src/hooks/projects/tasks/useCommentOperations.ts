"use client";

import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { commentSchema } from "@/lib/validations/comment";
import type { Comment, CommentFormData, Project } from "@/lib/types";

// Helper para converter timestamps
const convertTimestamp = (timestamp: any): string => {
  try {
    if (!timestamp) return new Date().toISOString();

    if (timestamp?.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toISOString();
    }

    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      return isNaN(date.getTime())
        ? new Date().toISOString()
        : date.toISOString();
    }

    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }

    return new Date().toISOString();
  } catch (error) {
    console.error("Error converting timestamp:", error);
    return new Date().toISOString();
  }
};

export function useCommentOperations() {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  const validateUser = useCallback(() => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    return user;
  }, [user]);

  const getUserInfo = useCallback(
    (project: Project) => {
      if (!user) return { name: "Usuário", avatar: undefined };

      const member = project.members?.find((m) => m.userId === user.uid);

      return {
        name: member?.name || user.displayName || user.email || "Usuário",
        avatar: member?.avatar || user.photoURL || undefined,
      };
    },
    [user],
  );

  const listenToComments = useCallback(
    (taskId: string, callback: (comments: Comment[]) => void) => {
      const commentsQuery = query(
        collection(db, "comments"),
        where("taskId", "==", taskId),
        orderBy("createdAt", "asc"),
      );

      return onSnapshot(
        commentsQuery,
        (snapshot) => {
          const comments = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              ...data,
              createdAt: convertTimestamp(data.createdAt),
              updatedAt: convertTimestamp(data.updatedAt),
            };
          }) as Comment[];

          callback(comments);
        },
        (error) => {
          console.error("Erro no listener de comentários:", error);
          callback([]);
        },
      );
    },
    [],
  );

  // ...existing code...

  const createComment = useCallback(
    async (
      commentData: CommentFormData,
      taskId: string,
      projectId: string,
      project: Project,
    ): Promise<Comment> => {
      const currentUser = validateUser();
      setIsLoading(true);

      try {
        const validatedData = commentSchema.parse(commentData);
        const userInfo = getUserInfo(project);

        // ✅ CORREÇÃO: Remover campos undefined
        const newCommentData: any = {
          ...validatedData,
          taskId,
          projectId,
          createdBy: currentUser.uid,
          createdByName: userInfo.name,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          edited: false,
        };

        // ✅ Só adicionar createdByAvatar se não for undefined
        if (userInfo.avatar) {
          newCommentData.createdByAvatar = userInfo.avatar;
        }

        const docRef = await addDoc(collection(db, "comments"), newCommentData);

        return {
          id: docRef.id,
          ...newCommentData,
          createdByAvatar: userInfo.avatar, // ✅ Pode ser undefined no retorno
          createdAt: newCommentData.createdAt.toDate().toISOString(),
          updatedAt: newCommentData.updatedAt.toDate().toISOString(),
        } as Comment;
      } catch (error) {
        console.error("Erro ao criar comentário:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser, getUserInfo],
  );

  // ...existing code...

  const updateComment = useCallback(
    async (commentId: string, content: string): Promise<void> => {
      validateUser();
      setIsLoading(true);

      try {
        const validatedData = commentSchema.parse({ content });

        await updateDoc(doc(db, "comments", commentId), {
          content: validatedData.content,
          updatedAt: Timestamp.now(),
          edited: true,
        });
      } catch (error) {
        console.error("Erro ao atualizar comentário:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const deleteComment = useCallback(
    async (commentId: string): Promise<void> => {
      validateUser();
      setIsLoading(true);

      try {
        await deleteDoc(doc(db, "comments", commentId));
      } catch (error) {
        console.error("Erro ao deletar comentário:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [validateUser],
  );

  const parseCommentError = useCallback((error: any): string => {
    if (error?.message?.includes("não autenticado")) {
      return "Você precisa estar logado para comentar";
    }

    if (error?.message?.includes("permissão")) {
      return "Você não tem permissão para esta ação";
    }

    return "Erro inesperado. Tente novamente.";
  }, []);

  return {
    createComment,
    updateComment,
    deleteComment,
    listenToComments,
    parseCommentError,
    isLoading,
  };
}
