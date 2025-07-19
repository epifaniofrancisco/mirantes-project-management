import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Project, User } from "@/lib/types";

interface DashboardState {
  projects: Project[];
  user: User | null;
  loading: boolean;
}

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    projects: [],
    user: null,
    loading: true,
  });
  const router = useRouter();

  const createUserFromFirebaseUser = useCallback(
    (firebaseUser: any, userData?: any): User => {
      return {
        id: firebaseUser.uid,
        name:
          userData?.name ||
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Usuário",
        email: userData?.email || firebaseUser.email || "",
        createdAt:
          userData?.createdAt ||
          firebaseUser.metadata.creationTime ||
          new Date().toISOString(),
      };
    },
    [],
  );

  const fetchUserData = useCallback(
    async (firebaseUser: any): Promise<User> => {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        const userData = userDoc.exists() ? userDoc.data() : null;
        return createUserFromFirebaseUser(firebaseUser, userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return createUserFromFirebaseUser(firebaseUser);
      }
    },
    [createUserFromFirebaseUser],
  );

  const setupProjectsListener = useCallback((userId: string) => {
    const projectsQuery = query(
      collection(db, "projects"),
      where("createdBy", "==", userId),
      orderBy("updatedAt", "desc"),
    );

    return onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setState((prev) => ({ ...prev, projects, loading: false }));
      },
      (error) => {
        console.error("Erro ao buscar projetos:", error);
        setState((prev) => ({ ...prev, loading: false }));
      },
    );
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await fetchUserData(firebaseUser);
        setState((prev) => ({ ...prev, user }));

        const unsubscribeProjects = setupProjectsListener(firebaseUser.uid);
        return () => unsubscribeProjects();
      } else {
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router, fetchUserData, setupProjectsListener]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [navigate]);

  const navigateToNewProject = useCallback(() => {
    navigate("/projects/new");
  }, [navigate]);

  const navigateToProject = useCallback(
    (projectId: string) => {
      navigate(`/projects/${projectId}`);
    },
    [navigate],
  );

  const navigateToEditProject = useCallback(
    (projectId: string) => {
      navigate(`/projects/${projectId}/edit`);
    },
    [navigate],
  );

  return {
    ...state,
    handleSignOut,
    navigateToNewProject,
    navigateToProject,
    navigateToEditProject,
  };
};
