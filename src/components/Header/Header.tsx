import { Button, Divider, Drawer } from "@mui/material";

import { IoMdMenu } from "react-icons/io";
import { useState } from "react";
import { MenuHeader } from "./components/MenuHeader";
import { Copy } from "phosphor-react";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/hooks/useToast";

export const Header = () => {
  const handleLogOut = async () => {};
  const { data: session } = useSession();
  const toast = useToastContext();
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };
  function copyToClipboard() {
    if (session?.user.id) {
      navigator.clipboard
        .writeText(
          `${process.env.NEXT_PUBLIC_URL_LOCAL}/schedule/${session.user.username}`
        )
        .then(() => {
          toast.success("Link copiado com sucesso!");
        })
        .catch((err) => {
          toast.error("Erro ao copiar para a área de transferência: ");
        });
    }
  }

  return (
    <>
      <header>
        <div className="mb-4">
          <div className="flex px-2 pt-8 pb-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="large"
                variant="outlined"
                onClick={() => setOpen(true)}
                color="info"
              >
                <IoMdMenu size={24} />
              </Button>
              <Button
                type="button"
                onClick={copyToClipboard}
                variant="contained"
                color="success"
                endIcon={<Copy />}
              >
                Minha Pagina
              </Button>
            </div>
            <Button
              size="large"
              variant="outlined"
              color="error"
              onClick={handleLogOut}
            >
              Sair
            </Button>
          </div>
          <Divider />
        </div>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <MenuHeader onCloseDrawer={onCloseDrawer} />
        </Drawer>
      </header>
    </>
  );
};
