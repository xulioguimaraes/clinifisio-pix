import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const useToastContext = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showToast = (
    severity: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };

  const toast = {
    success: (message: string) => showToast("success", message),
    error: (message: string) => showToast("error", message),
    info: (message: string) => showToast("info", message),
    warning: (message: string) => showToast("warning", message),
  };

  return (
    <ToastContext.Provider value={toast}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
};
