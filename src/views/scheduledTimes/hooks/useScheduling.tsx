import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { ModalScheduling } from "../components/ModalScheduling";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Modal } from "@/components/Modal/Modal";
import { IAppointments } from "@/types";
import { scheduling } from "@/services/schedulings";
import { useToastContext } from "@/hooks/useToast";
import dayjs from "dayjs";

interface SchedulingContextProps {
  handleScheduling: (value: IAppointments) => void;
  today: string;
  setToday: Dispatch<SetStateAction<string>>;
  params: {
    search: string;
    page: number;
    per_page: number;
  };
  setParams: Dispatch<
    SetStateAction<{
      search: string;
      page: number;
      per_page: number;
    }>
  >;
}

const SchedulingContext = createContext<SchedulingContextProps | undefined>(
  undefined
);

export function SchedulingProvider({ children }: { children: ReactNode }) {
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);
  const [isLoadingChangeStatus, setIsLoadingChangeStatus] = useState(false);
  const [params, setParams] = useState({ search: "", page: 1, per_page: 10 });

  const [valueStatusChangeStatus, setValueStatusChangeStatus] = useState<
    number | null
  >(null);
  const [today, setToday] = useState(dayjs().format("YYYY-MM-DD"));

  const [openModal, setOpenModal] = useState(false);
  const toast = useToastContext();
  const handleToogle = () => {
    setOpenModal((old) => !old);
  };
  const [schedulingData, setSchedulingData] = useState<IAppointments>(
    {} as IAppointments
  );
  const handleScheduling = (value: IAppointments) => {
    setSchedulingData(value);
    setValueStatusChangeStatus(value.status);
    handleToogle();
  };

  const handleEditScheduling = (schedulingData: IAppointments) => {
    setIsOpenModalChangeStatus(true);
  };
  const handleCloseModalChangeStatus = () => {
    setIsOpenModalChangeStatus(false);
  };

  const handleSaveStaus = async (status: number) => {
    setIsLoadingChangeStatus(true);
    const response = await scheduling.updateStatus(
      schedulingData.id,
      status,
      toast
    );
    if (response?.status === 200) {
      setSchedulingData((old) => ({ ...old, status }));
      toast.success(response.data.message);
      setIsOpenModalChangeStatus(false);

      //atualizar listagens,

      const newToday = today + " ";
      setToday(newToday);
      const paramsAux = { ...params };
      setParams((old) => ({ ...old, update: Math.random() }));
    }
    setIsLoadingChangeStatus(false);
  };

  const handleConfirmScheduling = async () => {
    await handleSaveStaus(2);
  };

  return (
    <SchedulingContext.Provider
      value={{ handleScheduling, today, setToday, params, setParams }}
    >
      <Modal
        onClose={handleCloseModalChangeStatus}
        isOpen={isOpenModalChangeStatus}
        title="Informações do Agendamento"
      >
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valueStatusChangeStatus}
              label="Status"
              onChange={(w) => {
                if (w.target.value) {
                  setValueStatusChangeStatus(w.target.value as number);
                }
              }}
            >
              <MenuItem value={1}>Pendente</MenuItem>
              <MenuItem value={2}>Confirmado</MenuItem>
              <MenuItem value={3}>Cancelado</MenuItem>
              <MenuItem value={4}>Atendido</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Button
              disabled={isLoadingChangeStatus}
              variant="contained"
              color="info"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              size="large"
              onClick={() => handleSaveStaus(valueStatusChangeStatus!)}
            >
              {isLoadingChangeStatus ? <CircularProgress size={22} /> : ""}
              Salvar
            </Button>
          </FormControl>
        </Stack>
      </Modal>
      {openModal && (
        <ModalScheduling
          isLoading={isLoadingChangeStatus}
          isOpen={openModal}
          handleConfirmScheduling={handleConfirmScheduling}
          onClose={handleToogle}
          scheduling={schedulingData}
          handleEditScheduling={handleEditScheduling}
        />
      )}
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error("useScheduling must be used within an SchedulingProvider");
  }
  return context;
}
