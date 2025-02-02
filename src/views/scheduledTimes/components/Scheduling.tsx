import { IAppointments } from "@/types";
import { Button } from "@mui/material";

export const Scheduling = ({
  data,
  onScheduling,
}: {
  data: IAppointments;
  onScheduling: (data: IAppointments) => void;
}) => {
  const handleScheduling = () => {
    onScheduling(data);
  };
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#dcf8c7",
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
