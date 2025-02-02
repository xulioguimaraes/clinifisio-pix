import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxW?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxW = "496px",
}: IModal) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={`[&_.MuiPaper-elevation]:max-w-[${maxW}] [&_.MuiPaper-elevation]:w-full`}
    >
      <DialogTitle id="alert-dialog-title">
        <h2>{title}</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
