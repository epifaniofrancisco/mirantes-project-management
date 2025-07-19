export const AUTH_ERROR_MESSAGES = {
  // Login errors
  "auth/user-not-found": "Email ou senha incorretos",
  "auth/wrong-password": "Email ou senha incorretos",
  "auth/invalid-credential": "Email ou senha incorretos",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/invalid-email": "Email inválido",

  // Registration errors
  "auth/email-already-in-use": "Este email já está em uso",
  "auth/weak-password": "Senha muito fraca",

  // Forgot password erros
  "auth/user-not-found-forgot": "Não encontramos uma conta criada com este email",
} as const;

export const FIELD_ERROR_MAPPINGS = {
  login: {
    "auth/invalid-email": "email",
  },
  register: {
    "auth/weak-password": "password",
    "auth/invalid-email": "email",
  },
  forgotPassword: {
    "auth/invalid-email": "email",
  },
} as const;

export const DEFAULT_MESSAGES = {
  login: "Erro ao fazer login. Tente novamente.",
  register: "Erro ao criar conta. Tente novamente.",
  forgotPassword: "Erro ao enviar email de recuperação. Tente novamente.",
  general: "Erro inesperado. Tente novamente.",
} as const;
