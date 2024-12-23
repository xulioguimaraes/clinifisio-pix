import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import authLogin from "../services/auth/authLogin";
import getTransaction from "../services/getTransaction";
import { supabase } from "../services/supabase";
import { Header } from "@/components/Header/Header";
import { NewTrasactionModal } from "@/components/NewTrasactionModal/NewTrasactionModal";
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default function Painel() {
  const router = useRouter();
  const [isNewTrasactionModalOpen, setIsNewTrasactionModalOpen] =
    useState(false);
  getTransaction();
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

  const handleOpenNewTransactionModal = () => {
    setIsNewTrasactionModalOpen(true);
  };
  const handleCloseNewTransactionModal = () => {
    setIsNewTrasactionModalOpen(false);
  };
  return (
    <>
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />
      <NewTrasactionModal
        isOpen={isNewTrasactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
      />
      <Dashboard />
    </>
  );
}
