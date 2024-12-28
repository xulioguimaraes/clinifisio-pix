import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import authLogin from "../services/auth/authLogin";
import { supabase } from "../services/supabase";
import { Header } from "@/components/Header/Header";
import { NewTrasactionModal } from "@/components/NewTrasactionModal/NewTrasactionModal";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { DataTableProvider } from "@/hooks/useDataTable";

export default function Painel() {
  const router = useRouter();

  const handleLogin = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (
      (session?.expires_at && session?.expires_at > new Date().getTime()) ||
      !session
    ) {
      authLogin(router);
    }
  };
  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <DataTableProvider>
      <NewTrasactionModal />
      <Dashboard />
    </DataTableProvider>
  );
}
