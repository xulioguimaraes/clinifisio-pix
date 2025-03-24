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
import { Router, useRouter } from "next/router";
import { ToastProvider } from "@/hooks/useToast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

NProgress.configure({ showSpinner: false });
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <QueryClientProviderDep client={queryClientDep}>
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
            <ToastProvider>
              <AuthProvider>
                <CssBaseline />
                <DefaultSeo
                  openGraph={{
                    type: "website",
                    locale: "pt_BR",
                    url: "https://www.urldaaplicação.ie/",
                    siteName: "CALL",
                  }}
                />

                <main className="px-2">
                  <Component {...pageProps} />
                </main>
              </AuthProvider>
            </ToastProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </QueryClientProviderDep>
  );
}
