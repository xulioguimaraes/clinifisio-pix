import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import styles from "./styles.module.scss";

import { IoMdMenu } from "react-icons/io";
import { useState } from "react";
import { Mail } from "@mui/icons-material";
import { MenuHeader } from "./components/MenuHeader";


export const Header = () => {
  const handleLogOut = async () => {};
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.containerHeader}>
        <div className={styles.content}>
          <div>
            <Button onClick={() => setOpen(true)} color="info">
              <IoMdMenu />
            </Button>
            <button type="button" onClick={handleLogOut} className={styles.out}>
              Sair
            </button>
          </div>
        </div>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <MenuHeader />
        </Drawer>
      </header>
    </>
  );
};
