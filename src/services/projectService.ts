import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projectSchema } from "@/lib/validations/project";
import { AuthUtils, type AuthResult } from "./authUtils";
import { Project, ProjectFormData, ProjectMember, User } from "@/lib/types";

export class ProjectService {
  static async validateFormData(
    formData: ProjectFormData,
  ): Promise<AuthResult<ProjectFormData>> {
    return AuthUtils.validateFormData(formData, projectSchema);
  }

  static async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  }

  static async createProject(
    formData: ProjectFormData,
    userId: string,
  ): Promise<string> {
    try {
      const userData = await this.getUserData(userId);

      if (!userData) {
        throw new Error("Dados do usuário não encontrados");
      }

      const creatorMember: ProjectMember = {
        userId: userData.id,
        email: userData.email,
        name: userData.name,
        role: "admin",
        addedAt: new Date().toISOString(),
      };

      const projectData: Omit<Project, "id"> = {
        ...formData,
        createdBy: userId,
        members: [creatorMember],
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "projects"), projectData);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      throw new Error("Falha ao criar projeto no banco de dados");
    }
  }

  static parseCreateProjectError(error: any): string {
    if (error.message?.includes("banco de dados")) {
      return error.message;
    }

    if (error.message?.includes("usuário não encontrados")) {
      return "Erro ao obter dados do usuário. Tente fazer login novamente.";
    }

    return "Erro inesperado ao criar projeto. Tente novamente.";
  }
}
