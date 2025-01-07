import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(WrappedComponent: React.FC) {
  return function ProtectedComponent(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated" && router.pathname !== "/") {
        router.push("/");
        return;
      } else if (status === "authenticated" && router.pathname === "/") {
        router.push("/painel");
      }
    }, [status, router]);

    if (status === "loading") {
      return (
        <div className="h-screen flex w-screen items-center justify-center flex-col">
          <CircularProgress />
          <p className="text-sm pt-4">Carregando...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
