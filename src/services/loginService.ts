import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginSchema } from "@/lib/validations/auth";
import {
  AuthUtils,
  type AuthResult,
  type FirebaseErrorResult,
} from "./authUtils";
import type { LoginFormData, FormErrors } from "@/lib/types";
import {
  AUTH_ERROR_MESSAGES,
  FIELD_ERROR_MAPPINGS,
  DEFAULT_MESSAGES,
} from "@/constants/authErrors";

export class LoginService {
  static async validateFormData(
    formData: LoginFormData,
  ): Promise<AuthResult<LoginFormData>> {
    const validationResult = loginSchema.safeParse(formData);

    return AuthUtils.validateFormData(
      formData, loginSchema
    );
  }

  static async signInUser(formData: LoginFormData): Promise<void> {
    await signInWithEmailAndPassword(auth, formData.email, formData.password);
  }

  static parseFirebaseError(error: any): FirebaseErrorResult {
    return AuthUtils.parseFirebaseError(
      error,
      AUTH_ERROR_MESSAGES,
      FIELD_ERROR_MAPPINGS.login,
      DEFAULT_MESSAGES.login
    );
  }
}
