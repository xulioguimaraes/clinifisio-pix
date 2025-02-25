import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

import { useState } from "react";
import { Copy } from "phosphor-react";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/hooks/useToast";
import MiniDrawer from "./Mini";
import TelegramIcon from "@mui/icons-material/Telegram";
import PersonIcon from "@mui/icons-material/Person";
export const Header = () => {
  const handleLogOut = async () => {};
  const { data: session } = useSession();
  const toast = useToastContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const link = `${process.env.NEXT_PUBLIC_URL_LOCAL}/schedule/${session?.user
    .username!}`;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function copyToClipboard() {
    if (session?.user.id) {
      navigator.clipboard
        .writeText(link)
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
              <div></div>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Perfil">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Perfil
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => window.open(link, "_blank")}>
                  <ListItemIcon>
                    <TelegramIcon fontSize="small" />
                  </ListItemIcon>
                  Ir Para Pagina
                </MenuItem>
                <MenuItem onClick={copyToClipboard}>
                  <ListItemIcon>
                    <Copy fontSize="small" />
                  </ListItemIcon>
                  Copiar Link Pagina
                </MenuItem>
              </Menu>
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
        <MiniDrawer />
      </header>
    </>
  );
};
