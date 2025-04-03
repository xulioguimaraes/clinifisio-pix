import { IAppointments } from "@/types";
import { Button, Typography } from "@mui/material";
import { useScheduling } from "../hooks/useScheduling";

export const Scheduling = ({ data }: { data: IAppointments }) => {
  const { handleScheduling: onScheduling } = useScheduling();
  const statusColors: Record<number, string> = {
    1: "#dcf8c6", // Pendente (verde claro)
    2: "#a8e76a", // Confirmado (verde mais vibrante para destaque)
    3: "#f8c6c6", // Cancelado (vermelho claro, mas suave)
    4: "#c6e7f8", // Atendido (azul claro para um tom profissional)
  };
  const handleScheduling = () => {
    onScheduling(data);
  };
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: statusColors[data?.status],
        width: "100%",
        maxWidth: 150,
        flexDirection: "column",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
      type="button"
      onClick={handleScheduling}
    >
      <Typography
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {data?.service?.name}
      </Typography>
      <Typography
        className="text-xs text-gray-500"
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "0.75rem", // Equivalente ao text-xs
          color: "#6b7280", // Equivalente ao text-gray-500
        }}
      >
        {data?.name}
      </Typography>
    </Button>
  );
};
