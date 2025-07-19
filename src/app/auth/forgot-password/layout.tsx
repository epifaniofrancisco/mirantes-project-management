import type React from "react"
import { AuthCheck } from "@/components/auth/AuthCheck"

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck redirectTo="/dashboard" requireAuth={false}>
      {children}
    </AuthCheck>
  )
}
