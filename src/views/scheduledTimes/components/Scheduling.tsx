import { IAppointments } from "@/types";
import { Button } from "@mui/material";
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
        flexDirection: "column",
      }}
      type="button"
      onClick={handleScheduling}
    >
      <p>{data?.service?.name}</p>
      <p className="text-xs text-gray-500">{data?.name}</p>
    </Button>
  );
};
