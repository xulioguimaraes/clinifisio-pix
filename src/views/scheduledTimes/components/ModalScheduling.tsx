import { Modal } from "@/components/Modal/Modal";
import { IAppointments } from "@/types";
import { converNumberForMoney } from "@/utils/conver-time-string-to-minutes";
import { WhatsApp } from "@mui/icons-material";
import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";

export const ModalScheduling = ({
  scheduling,
  isOpen,
  onClose,
}: {
  scheduling: IAppointments;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} title="Informações do Agendamento">
      <Box className="">
        <Box alignItems={"baseline"} className="flex  gap-2">
          <span>Horario:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.hours}:00
          </Box>
        </Box>
        <Divider />
        <Box alignItems={"baseline"} className="flex  gap-2">
          <span>Cliente:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.name}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Observações:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.observations}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Telefone:</span>{" "}
          <Box
            fontSize={22}
            component={"a"}
            href={`https://wa.me/+55${scheduling.phone}`}
          >
            {scheduling.phone} <WhatsApp fontSize="medium" />
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Email:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.email}
          </Box>
        </Box>
        <Divider />
      </Box>

      <Box mt={2} border={1} borderColor={'GrayText'} p={2} borderRadius={2}>
        <h1 className="text-xl">Serviço Agendado</h1>

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Serviço:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.service?.name}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Descrição:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {scheduling.service?.description}
          </Box>
        </Box>
        <Divider />

        <Box alignItems={"baseline"} className="flex gap-2">
          <span>Preço:</span>{" "}
          <Box fontSize={22} component={"p"}>
            {converNumberForMoney(+scheduling?.service?.price)}
          </Box>
        </Box>
        <Divider />
      </Box>
    </Modal>
  );
};
