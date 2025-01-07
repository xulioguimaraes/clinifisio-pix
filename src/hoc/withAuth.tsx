import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(WrappedComponent: React.FC) {
  return function ProtectedComponent(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/");
      } else if (status === "authenticated" && router.pathname === "/login") {
        router.push("/painel");
      }
    }, [status, router]);

    if (status === "loading") {
      return <p>Carregando...</p>;
    }

    return <WrappedComponent {...props} />;
  };
}
