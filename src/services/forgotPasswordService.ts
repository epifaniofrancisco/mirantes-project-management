import { sendPasswordResetEmail } from "firebase/auth";
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

export class ForgotPasswordService {
  static async validateFormData(
    formData: ForgotPasswordFormData,
  ): Promise<AuthResult<ForgotPasswordFormData>> {
    return AuthUtils.validateFormData(formData, forgotPasswordSchema);
  }

  static async sendResetEmail(formData: ForgotPasswordFormData): Promise<void> {
    await sendPasswordResetEmail(auth, formData.email, {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: false,
    });
  }

  static parseFirebaseError(error: any): FirebaseErrorResult {
    const errorMessages = {
      ...AUTH_ERROR_MESSAGES,
      "auth/user-not-found": "Não encontramos uma conta criada com este email",
    };

    return AuthUtils.parseFirebaseError(
      error,
      errorMessages,
      FIELD_ERROR_MAPPINGS.forgotPassword,
      DEFAULT_MESSAGES.forgotPassword,
    );
  }
}
