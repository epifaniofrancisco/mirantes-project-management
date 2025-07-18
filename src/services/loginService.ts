import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginSchema } from "@/lib/validations/auth";
import type { LoginFormData, FormErrors } from "@/lib/types";

const FIREBASE_ERROR_MESSAGES = {
  "auth/user-not-found": "Usuário não encontrado",
  "auth/wrong-password": "Senha incorreta",
  "auth/invalid-credential": "Credenciais inválidas",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/invalid-email": "Email inválido",
} as const;

export class LoginService {
  static async validateFormData(
    formData: LoginFormData,
  ): Promise<{ success: boolean; errors?: FormErrors }> {
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === "string") {
          errors[field] = issue.message;
        }
      });
      return { success: false, errors };
    }

    return { success: true };
  }

  static async signInUser(formData: LoginFormData): Promise<void> {
    await signInWithEmailAndPassword(auth, formData.email, formData.password);
  }

  static parseFirebaseError(error: any): {
    type: "field" | "general";
    message: string;
    field?: string;
  } {
    if (error.code) {
      const message =
        FIREBASE_ERROR_MESSAGES[
          error.code as keyof typeof FIREBASE_ERROR_MESSAGES
        ];

      if (error.code === "auth/invalid-email") {
        return {
          type: "field",
          message: message || "Email inválido",
          field: "email",
        };
      }

      return {
        type: "general",
        message: message || "Erro ao fazer login",
      };
    }

    return {
      type: "general",
      message: "Erro inesperado. Tente novamente mais tarde.",
    };
  }
}
