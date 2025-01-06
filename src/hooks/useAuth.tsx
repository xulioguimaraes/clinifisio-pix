import { api } from "@/services/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { users } from "@/services/users";
interface AuthContextType {}

const AuthContext = createContext<AuthContextType>({
  count: 0,
  increment: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const SECRET_KEY = "minha-chave-secreta";

// Função para gerar o token
const generateToken = (userId: string) => {
  const payload = {
    id: userId,
  };

  // Gerar o token com expiração de 1 hora
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });

  return token;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const getUserData = async () => {
    const response = await users.getUserData();

    console.log(response.data);
  };
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/login") {
      router.push("/painel");
      getUserData();
    }
  }, [session]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
