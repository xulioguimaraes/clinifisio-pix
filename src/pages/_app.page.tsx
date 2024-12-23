import { globalStyles } from "@/styles/global";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../lib/dayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { DefaultSeo } from "next-seo";
import { QueryClientProvider as QueryClientProviderDep } from "react-query";
import { queryClient as queryClientDep } from "../services/queryClient";

globalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProviderDep client={queryClientDep}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <DefaultSeo
            openGraph={{
              type: "website",
              locale: "pt_BR",
              url: "https://www.urldaaplicação.ie/",
              siteName: "CALL",
            }}
          />
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </QueryClientProviderDep>
  );
}
