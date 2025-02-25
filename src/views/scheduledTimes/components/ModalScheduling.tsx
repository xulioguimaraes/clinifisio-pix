import { Modal } from "@/components/Modal/Modal";
import { IAppointments } from "@/types";
import { converNumberForMoney } from "@/utils/conver-time-string-to-minutes";
import { WhatsApp } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

export const ModalScheduling = ({
  scheduling,
  isOpen,
  onClose,
  handleEditScheduling,
  handleConfirmScheduling,
  isLoading,
}: {
  scheduling: IAppointments;
  isOpen: boolean;
  onClose: () => void;
  handleEditScheduling: (event: IAppointments) => void;
  handleConfirmScheduling: () => void;
  isLoading: boolean;
}) => {
  const status = [
    { id: 1, name: "Pendente" },
    { id: 2, name: "Confirmado" },
    { id: 3, name: "Cancelado" },
    { id: 4, name: "Atendido" },
  ];
  const statusColors: Record<number, string> = {
    1: "#dcf8c6", // Pendente (verde claro)
    2: "#a8e76a", // Confirmado (verde mais vibrante para destaque)
    3: "#f8c6c6", // Cancelado (vermelho claro, mas suave)
    4: "#c6e7f8", // Atendido (azul claro para um tom profissional)
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} title="Informações do Agendamento">
      <Box className="">
        <Box component={"p"}>
          Status:{" "}
          <Typography
            sx={{
              color: statusColors[scheduling.status],
              fontWeight: 600,
            }}
            component={"span"}
          >
            {status.find((item) => item.id === scheduling.status)?.name}
          </Typography>
        </Box>
        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Horario:</span> <Box component={"p"}>{scheduling.hours}:00</Box>
        </Box>
        <Divider />
        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Cliente:</span> <Box component={"p"}>{scheduling.name}</Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Observações:</span>{" "}
          <Box component={"p"}>{scheduling.observations}</Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Telefone:</span>{" "}
          <Box
            fontSize={18}
            component={"a"}
            borderRadius={12}
            my={0.5}
            bgcolor="#dcf8c7"
            px={2}
            color={"black"}
            href={`https://wa.me/+55${scheduling.phone}`}
          >
            {scheduling.phone} <WhatsApp fontSize="medium" />
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Email:</span> <Box component={"p"}>{scheduling.email}</Box>
        </Box>
        <Divider />
      </Box>

      <Box mt={2} border={1} borderColor={"GrayText"} p={2} borderRadius={2}>
        <h1 className="text-xl">Serviço Agendado</h1>

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Serviço:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.service?.name}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Descrição:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.service?.description}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} display={"flex"} gap={1}>
          <span>Preço:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {converNumberForMoney(+scheduling?.service?.price)}
          </Box>
        </Box>
        <Divider />
      </Box>
      <Box
        pt={2}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        flexDirection={"column"}
        gap={1}
      >
        {scheduling.status === 1 && (
          <Button
            onClick={handleConfirmScheduling}
            type="button"
            disabled={isLoading}
            fullWidth
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
            color="success"
            variant="contained"
          >
            {isLoading ? <CircularProgress size={22} /> : ""} Confirmar
            Agendamento
          </Button>
        )}
        <Button
          type="button"
          onClick={() => handleEditScheduling(scheduling)}
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          disabled={isLoading}
          color="secondary"
          variant="contained"
        >
          {isLoading ? <CircularProgress size={22} /> : ""} Editar Status
          Agendamento
        </Button>
      </Box>
    </Modal>
  );
};
