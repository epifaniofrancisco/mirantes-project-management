import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import {
  AuthUtils,
  type AuthResult,
  type FirebaseErrorResult,
} from "./authUtils";
import type { ForgotPasswordFormData } from "@/lib/types";
import {
  AUTH_ERROR_MESSAGES,
  FIELD_ERROR_MAPPINGS,
  DEFAULT_MESSAGES,
} from "@/constants/authErrors";

const FORGOT_PASSWORD_ERROR_MESSAGES = {
  "auth/user-not-found": "Não encontramos uma conta registrada com este email",
  "auth/invalid-email": "Email inválido",
  "auth/too-many-requests":
    "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente",
  "auth/network-request-failed":
    "Erro de conexão. Verifique sua internet e tente novamente",
} as const;

const FORGOT_PASSWORD_FIELD_MAPPINGS = {
  "auth/invalid-email": "email",
} as const;

export class ForgotPasswordService {
  static async validateFormData(
    formData: ForgotPasswordFormData,
  ): Promise<AuthResult<ForgotPasswordFormData>> {
    return AuthUtils.validateFormData(formData, forgotPasswordSchema);
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error: any) {
      console.error("Erro ao verificar email:", error);
      return false;
    }
  }

  static async sendResetEmail(formData: ForgotPasswordFormData): Promise<void> {
    try {
      const emailExists = await this.checkEmailExists(formData.email);

      if (!emailExists) {
        throw {
          code: "auth/user-not-found",
          message: "Email não encontrado na base de dados",
        };
      }

      console.log("Email encontrado, enviando email de recuperação...");

      await sendPasswordResetEmail(auth, formData.email, {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: false,
      });
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      throw error;
    }
  }

  static parseFirebaseError(error: any): FirebaseErrorResult {
    const errorMessages = {
      ...AUTH_ERROR_MESSAGES,
      "auth/user-not-found":
        "Não encontramos uma conta criada com este email",
    };

    return AuthUtils.parseFirebaseError(
      error,
      errorMessages,
      FIELD_ERROR_MAPPINGS.forgotPassword,
      DEFAULT_MESSAGES.forgotPassword,
    );
  }
}
