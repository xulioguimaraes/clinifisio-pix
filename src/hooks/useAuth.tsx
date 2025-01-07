import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { users } from "@/services/users";
interface AuthContextType {}

const AuthContext = createContext<AuthContextType>({
  count: 0,
  increment: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const getUserData = async () => {
    const response = await users.getUserData();

    console.log(response.data);
  };
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/") {
      router.push("/painel");
      getUserData();
    }
  }, [session]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
