import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { Header } from "@/components/Header/Header";
import { useMediaQuery } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { links } from "@/components/Header/components/datamenu";
import { NextSeo } from "next-seo";
interface AuthContextType {
  handleLogOut: () => void;
  isAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  handleLogOut: () => {},
  isAuth: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status, data } = useSession();

  const matches = useMediaQuery((theme) => theme?.breakpoints.up("sm"));
  const routerNoShowMenu = [
    "/",
    "/login",
    "/register",
    "/register/connect-calendar",
    "/register/time-intervals",
    "/register/update-profile",
    `/schedule`,
  ];
  const shouldHideHeader =
    routerNoShowMenu.includes(router.pathname) ||
    router.pathname.startsWith("/schedule");

  const handleLogOut = async () => {
    signOut();
    router.push("/");
  };

  const isAuth = status === "authenticated";

  const namePage = links.find((item) => item.link === router.pathname);
  return (
    <AuthContext.Provider value={{ handleLogOut, isAuth }}>
      <NextSeo
        title={`${namePage?.name || "Agendamento"} ${
          data?.user.name ? ` | ${data?.user?.name}` : ""
        }`}
        noindex
      />
      <div
        style={{
          paddingLeft: !shouldHideHeader && !matches === false ? "4rem" : "",
        }}
        className="max-w-screen-xl mx-auto my-0 "
      >
        {!shouldHideHeader && <Header />}
        {children}
      </div>
    </AuthContext.Provider>
  );
};
