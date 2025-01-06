import { globalStyles } from "@/styles/global";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import "../lib/dayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { DefaultSeo } from "next-seo";
import { QueryClientProvider as QueryClientProviderDep } from "react-query";
import { queryClient as queryClientDep } from "../services/queryClient";
import "@/styles/global.css";
globalStyles();
import "@/styles/global.scss";
import { AuthProvider } from "@/hooks/useAuth";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Header } from "@/components/Header/Header";
import { useRouter } from "next/router";
import { ToastProvider } from "@/hooks/useToast";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  const routerNoShowMenu = [
    "/",
    "/login",
    "/register",
    "/connect-calendar",
    "/register/time-intervals",
    "/update-profile",
    "/schedule",
  ];
  return (
    <QueryClientProviderDep client={queryClientDep}>
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
            <AuthProvider>
              <ToastProvider>
                <CssBaseline />
                <DefaultSeo
                  openGraph={{
                    type: "website",
                    locale: "pt_BR",
                    url: "https://www.urldaaplicação.ie/",
                    siteName: "CALL",
                  }}
                />
                <div className="max-w-screen-lg mx-auto my-0 ">
                  {!routerNoShowMenu.includes(router.pathname) && <Header />}
                  <main className="px-2">
                    <Component {...pageProps} />
                  </main>
                </div>
              </ToastProvider>
            </AuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </QueryClientProviderDep>
  );
}
