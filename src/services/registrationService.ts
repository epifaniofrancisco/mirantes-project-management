import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { RegisterFormData } from "@/lib/types";
import { registerSchema } from "@/lib/validations/auth";
import {
  AuthUtils,
  type AuthResult,
  type FirebaseErrorResult,
} from "./authUtils";
import {
  AUTH_ERROR_MESSAGES,
  FIELD_ERROR_MAPPINGS,
  DEFAULT_MESSAGES,
} from "@/constants/authErrors";

export class RegistrationService {
  static async validateFormData(
    formData: RegisterFormData,
  ): Promise<AuthResult<RegisterFormData>> {
    return AuthUtils.validateFormData(formData, registerSchema);
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

  static parseFirebaseError(error: any): FirebaseErrorResult {
    return AuthUtils.parseFirebaseError(
      error,
      AUTH_ERROR_MESSAGES,
      FIELD_ERROR_MAPPINGS.register,
      DEFAULT_MESSAGES.register,
    );
  }
}
