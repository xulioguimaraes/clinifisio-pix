import { IsLoadingCompoenent } from "@/components/IsLoadingComponent";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(WrappedComponent: React.FC | any) {
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
      return <IsLoadingCompoenent />;
    }

    return <WrappedComponent {...props} />;
  };
}
