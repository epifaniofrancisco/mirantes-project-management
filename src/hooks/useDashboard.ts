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
import type { User as FirebaseUser } from "firebase/auth";
import { useProjectOperations } from "./useProjectOperations";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  const router = useRouter();

  const {
    deleteProject,
    parseError,
    isLoading: isDeleting,
  } = useProjectOperations();

  const createUserFromFirebaseUser = useCallback(
    (firebaseUser: FirebaseUser, userData?: any): User => {
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
    async (firebaseUser: FirebaseUser): Promise<User> => {
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

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
    setDeleteError("");
  }, []);

  const confirmDeleteProject = useCallback(async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      setDeleteError("");
    } catch (error: any) {
      console.error("Erro ao deletar projeto:", error);
      const errorMessage = parseError(error, "delete");
      setDeleteError(errorMessage);
    }
  }, [projectToDelete, deleteProject, parseError]);

  const cancelDeleteProject = useCallback(() => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
    setDeleteError("");
  }, []);

  return {
    ...state,
    deleteDialogOpen,
    deleteError,
    isDeleting,
    handleSignOut,
    navigateToNewProject,
    navigateToProject,
    navigateToEditProject,
    handleDeleteProject,
    confirmDeleteProject,
    cancelDeleteProject,
  };
};
