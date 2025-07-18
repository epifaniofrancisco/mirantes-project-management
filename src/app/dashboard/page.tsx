"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { LogOut } from "lucide-react";
import type { UserData } from "@/lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/auth/register");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/register");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Membro desde{" "}
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-700">ID do Usuário</h3>
                <p className="text-sm text-slate-600 font-mono">{user.id}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-700">Data de Criação</h3>
                <p className="text-sm text-slate-600">
                  {new Date(user.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
