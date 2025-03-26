import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { Header } from "@/components/Header/Header";
import { useMediaQuery } from "@mui/material";
interface AuthContextType {}

const AuthContext = createContext<AuthContextType>({
  count: 0,
  increment: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
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

  return (
    <AuthContext.Provider value={{}}>
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
