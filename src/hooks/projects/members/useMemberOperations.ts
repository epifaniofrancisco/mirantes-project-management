import { useState, useCallback } from "react";
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { memberSchema } from "@/lib/validations/project";
import type { ProjectMember, MemberFormData } from "@/lib/types";

export function useMemberOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const findUserByEmail = useCallback(async (email: string) => {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email),
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      return null;
    }

    const userData = usersSnapshot.docs[0].data();
    const userId = usersSnapshot.docs[0].id;

    return { userData, userId };
  }, []);

  const addMember = useCallback(
    async (
      projectId: string,
      formData: MemberFormData,
      currentMembers: ProjectMember[] = [],
    ): Promise<ProjectMember> => {
      setIsLoading(true);

      try {
        // Validar dados
        const validatedData = memberSchema.parse(formData);

        // Buscar usuário
        const userResult = await findUserByEmail(validatedData.email);
        if (!userResult) {
          throw new Error("Usuário não encontrado no sistema");
        }

        const { userData, userId } = userResult;

        // Verificar se já é membro
        const existingMember = currentMembers.find(
          (member) => member.userId === userId,
        );
        if (existingMember) {
          throw new Error("Este usuário já é membro do projeto");
        }

        // Criar novo membro
        const newMember: ProjectMember = {
          userId,
          email: validatedData.email,
          name: userData.name || "",
          role: validatedData.role,
          addedAt: new Date().toISOString(),
        };

        const updatedMembers = [...currentMembers, newMember];
        const updatedMemberIds = updatedMembers.map((member) => member.userId); // ✅ ADICIONADO

        // Atualizar no Firestore
        await updateDoc(doc(db, "projects", projectId), {
          members: updatedMembers,
          memberIds: updatedMemberIds, // ✅ ADICIONADO: Manter array de IDs sincronizado
          updatedAt: new Date().toISOString(),
        });

        return newMember;
      } catch (error) {
        console.error("Erro ao adicionar membro:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [findUserByEmail],
  );

  const removeMember = useCallback(
    async (
      projectId: string,
      memberId: string,
      currentMembers: ProjectMember[] = [],
    ): Promise<ProjectMember[]> => {
      try {
        const updatedMembers = currentMembers.filter(
          (member) => member.userId !== memberId,
        );
        const updatedMemberIds = updatedMembers.map((member) => member.userId); // ✅ ADICIONADO

        await updateDoc(doc(db, "projects", projectId), {
          members: updatedMembers,
          memberIds: updatedMemberIds, // ✅ ADICIONADO
          updatedAt: new Date().toISOString(),
        });

        return updatedMembers;
      } catch (error) {
        console.error("Erro ao remover membro:", error);
        throw error;
      }
    },
    [],
  );

  const updateMemberRole = useCallback(
    async (
      projectId: string,
      memberId: string,
      newRole: string,
      currentMembers: ProjectMember[] = [],
    ): Promise<ProjectMember[]> => {
      try {
        const updatedMembers = currentMembers.map((member) =>
          member.userId === memberId
            ? { ...member, role: newRole as "admin" | "member" | "viewer" }
            : member,
        );

        await updateDoc(doc(db, "projects", projectId), {
          members: updatedMembers,
          updatedAt: new Date().toISOString(),
        });

        return updatedMembers;
      } catch (error) {
        console.error("Erro ao atualizar papel do membro:", error);
        throw error;
      }
    },
    [],
  );

  const parseError = useCallback((error: any): string => {
    if (error.message?.includes("não encontrado no sistema")) {
      return "Usuário não encontrado no sistema";
    }

    if (error.message?.includes("já é membro")) {
      return "Este usuário já é membro do projeto";
    }

    if (error.name === "ZodError") {
      return "Dados inválidos";
    }

    return "Erro inesperado. Tente novamente.";
  }, []);

  return {
    // Operações
    addMember,
    removeMember,
    updateMemberRole,

    // Utilitários
    parseError,

    // Estado
    isLoading,
  };
}
