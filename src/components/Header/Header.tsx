import { Button, Divider, Drawer } from "@mui/material";

import { IoMdMenu } from "react-icons/io";
import { useState } from "react";
import { MenuHeader } from "./components/MenuHeader";

export const Header = () => {
  const handleLogOut = async () => {};
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <header>
        <div className="mb-4">
          <div className="flex px-8 pt-8 pb-4 items-center justify-between">
            <Button
              size="large"
              variant="outlined"
              onClick={() => setOpen(true)}
              color="info"
            >
              <IoMdMenu size={24} />
            </Button>
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
