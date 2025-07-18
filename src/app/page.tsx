"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-white to-slate-100">
      <section className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
          <span className="text-primary">Gerencie</span> seus projetos com <span className="text-primary">eficiência</span> e <span className="text-primary">colaboração</span>.
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          A <strong className="text-primary">Mirantes</strong> é uma plataforma moderna de gestão
          de projetos, com login seguro, controle de tarefas e colaboração em
          tempo real.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/auth/login")}>
            Entrar
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/auth/register")}
          >
            Criar Conta
          </Button>
        </div>
      </section>
    </main>
  );
}
