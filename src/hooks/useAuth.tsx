import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {}

const AuthContext = createContext<AuthContextType>({
  count: 0,
  increment: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  console.log(session);
  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/painel");
    }
  }, [session]);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
