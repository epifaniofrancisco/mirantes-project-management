import type { ZodSchema } from "zod";
import type { FormErrors } from "@/lib/types";

export interface AuthResult<T> {
  success: boolean;
  errors?: FormErrors;
  data?: T;
}

export interface FirebaseErrorResult {
  type: "field" | "general";
  message: string;
  field?: string;
}

export class AuthUtils {
  static async validateFormData<T>(
    formData: T,
    schema: ZodSchema<T>,
  ): Promise<AuthResult<T>> {
    const validationResult = schema.safeParse(formData);

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

    return { success: true, data: validationResult.data };
  }

  static parseFirebaseError(
    error: any,
    errorMessages: Record<string, string>,
    fieldSpecificErrors: Record<string, string> = {},
    defaultMessage: string = "Erro inesperado. Tente novamente.",
  ): FirebaseErrorResult {
    if (error.code) {
      const message = errorMessages[error.code];

      const fieldMapping = fieldSpecificErrors[error.code];
      if (fieldMapping) {
        return {
          type: "field",
          message: message || "Erro de validação",
          field: fieldMapping,
        };
      }

      return {
        type: "general",
        message: message || defaultMessage,
      };
    }

    return {
      type: "general",
      message: defaultMessage,
    };
  }
}
