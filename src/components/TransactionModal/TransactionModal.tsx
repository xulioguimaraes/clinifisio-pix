import React, { FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Modal } from "../Modal/Modal";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Box,
} from "@mui/material";
import { transaction as transactionservice } from "@/services/transaction";
import { useDataTableContext } from "@/hooks/useDataTable";
import { useToastContext } from "@/hooks/useToast";
import { ITransaction } from "@/types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";

// Configure dayjs to use Brazilian locale and UTC
dayjs.extend(utc);
dayjs.locale("pt-br");

interface ITransactionModal {
  isOpen: boolean;
  setModal: () => void;
  transaction: ITransaction;
}

const initialValues = () => {
  return {
    id: "",
    title: "",
    price: 0,
    description: "",
    type: true,
    createdAt: "",
    transactionDate: dayjs().format("YYYY-MM-DD"),
  };
};

export const TransactionModal = ({
  isOpen,
  setModal,
  transaction,
}: ITransactionModal) => {
  const [values, setValues] = useState<ITransaction>(transaction);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const { params, setParams } = useDataTableContext();
  const toast = useToastContext();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(transaction.createdAt).utc()
  );

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setValues(transaction);
    setSelectedDate(dayjs(transaction.createdAt).utc());
  }, [transaction, isOpen]);

  const handleCreateNewTransaction = async (e: FormEvent) => {
    e.preventDefault();
  };

  const onRequestClose = () => {
    setValues(initialValues);
    setSelectedDate(dayjs());
    setModal();
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await transactionservice.deleteTransaction(id);
      setIsLoading(false);

      const copyParams = { ...params };
      setParams(copyParams);
      toast.success("Transação excluida com sucesso");
      onRequestClose();
    } catch (error: any) {
      console.log(error.response.data.error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onRequestClose}
        title="Informações da transação"
      >
        <form
          className="flex flex-col gap-2"
          onSubmit={handleCreateNewTransaction}
        >
          {error && (
            <section className="__error">
              <h3>{"Erro ao deletar transação"}</h3>
            </section>
          )}
          <TextField
            fullWidth
            type="text"
            name="title"
            value={values?.title}
            disabled
            placeholder="Titulo"
          />
          <TextField
            fullWidth
            type="text"
            name="price"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(values?.price) / 100)}
            disabled
            placeholder="Valor"
          />

          <Box
            sx={{ width: "100%" }}
            display="flex"
            gap={1}
            justifyContent={"center"}
          >
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Data da Transação"
                value={selectedDate}
                disabled
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <div className={styles.typeTransaction}>
            <button
              className={values?.type ? styles.deposit : ""}
              disabled
              type="button"
            >
              <img src="/images/income.svg" alt="Entrada" />
              <span>Entrada</span>
            </button>
            <button
              disabled
              className={values?.type ? "" : styles.withraw}
              type="button"
            >
              <img src="/images/outcome.svg" alt="Saida" />
              <span>Saida</span>
            </button>
          </div>
          <TextField
            multiline
            maxRows={4}
            fullWidth
            name="description"
            disabled
            value={values?.description}
            placeholder="Descrição"
          />
          <div className="w-full flex gap-2">
            <Button
              variant="contained"
              color="error"
              size="large"
              disabled={isLoading}
              onClick={() => handleDelete(values?.id!)}
              className={styles.delete}
              fullWidth
            >
              {isLoading ? <CircularProgress size={22} /> : "Deletar"}
            </Button>
            <Button
              onClick={onRequestClose}
              variant="contained"
              disabled={isLoading}
              size="large"
              color="primary"
              type="submit"
              fullWidth
            >
              {isLoading ? <CircularProgress size={22} /> : "Fechar"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
