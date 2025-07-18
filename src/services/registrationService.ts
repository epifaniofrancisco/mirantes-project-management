import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { RegisterFormData } from "@/lib/types";
import { registerSchema } from "@/lib/validations/auth";
interface FormErrors {
  [key: string]: string;
}

const FIREBASE_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Este email já está em uso",
  "auth/weak-password": "Senha muito fraca",
  "auth/invalid-email": "Email inválido",
} as const;

export class RegistrationService {
  static async validateFormData(
    formData: RegisterFormData,
  ): Promise<{ success: boolean; errors?: FormErrors }> {
    const validationResult = registerSchema.safeParse(formData);

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

  static async createUser(formData: RegisterFormData): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name: formData.name,
      email: formData.email,
      createdAt: new Date().toISOString(),
    });
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

      if (error.code === "auth/weak-password") {
        return {
          type: "field",
          message: message || "Senha muito fraca",
          field: "password",
        };
      }

      if (error.code === "auth/invalid-email") {
        return {
          type: "field",
          message: message || "Email inválido",
          field: "email",
        };
      }

      return {
        type: "general",
        message: message || "Erro ao criar conta. Tente novamente.",
      };
    }

    return { type: "general", message: "Erro inesperado. Tente novamente." };
  }
}
