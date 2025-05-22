import { FormEvent, useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { transaction } from "@/services/transaction";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useDataTableContext } from "@/hooks/useDataTable";
import { Modal } from "../Modal/Modal";
import { useToastContext } from "@/hooks/useToast";
import { IValuesTransactionModal } from "@/types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import React from "react";

// Configure dayjs to use Brazilian locale
dayjs.locale("pt-br");

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const initialValues = () => {
  return {
    title: "",
    price: "",
    description: "",
    type: true,
    transactionDate: dayjs().format("YYYY-MM-DD"),
  };
};

export const NewTrasactionModal = () => {
  const {
    onCloseNewTransactionModal: onRequestClose,
    isNewTrasactionModalOpen: isOpenModal,
    params,
    setParams,
  } = useDataTableContext();
  const [type, setType] = useState(false);
  const [values, setValues] = useState<IValuesTransactionModal>(initialValues);
  const [error, setError] = useState(false);
  const [valueIsEmpty, setValueIsEmpty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Reset form when modal opens
  useEffect(() => {
    if (isOpenModal) {
      setValues(initialValues);
      setSelectedDate(dayjs());
      setType(false);
      setError(false);
      setValueIsEmpty(false);
    }
  }, [isOpenModal]);

  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (values.title === "" || values.price === "" || !selectedDate) {
      setValueIsEmpty(true);
      return;
    }
    const objSend = {
      ...values,
      price: values.price.replace(/[^0-9]/g, ""),
      type: type,
      transactionDate: selectedDate.format("YYYY-MM-DD"),
    };
    setIsOpen(true);
    setIsLoading(true);
    const response = await transaction.createTransaction(objSend);
    setIsOpen(false);
    setIsLoading(false);

    if (response.status === 200) {
      const copyParams = { ...params };
      setParams(copyParams);
      setValues(initialValues);
      setSelectedDate(dayjs());
      closeSpinner();
      toast.success("Transação cadastrada com sucesso");
      return onRequestClose();
    }
    return setError(true);
  };

  const closeSpinner = () => {
    setIsOpen(false);
  };

  const onChangeInputs = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (values.title !== "") {
      setValueIsEmpty(false);
    }
    if (name === "price") {
      return setValues({
        ...values,
        [name]: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(value.replace(/[^0-9]/g, "")) / 100),
      });
    }
    setValues({ ...values, [name]: value });
  };

  const onRequestClosed = () => {
    setValues(initialValues);
    setSelectedDate(dayjs());
    return onRequestClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpenModal}
        onClose={onRequestClosed}
        title={"Cadastar Transação"}
      >
        <Box
          component={"form"}
          className="flex flex-col gap-2"
          onSubmit={handleCreateNewTransaction}
        >
          {error && (
            <section className="__error">
              <h3>{"Erro ao cadastar transação"}</h3>
            </section>
          )}
          {valueIsEmpty && (
            <section className="__error">
              <h3>
                {"Preencha os campos de Titulo, Preço e Data da Transação"}
              </h3>
            </section>
          )}
          <TextField
            type="text"
            name="title"
            onChange={(e) => onChangeInputs(e)}
            placeholder="Titulo"
            fullWidth
          />
          <TextField
            type="text"
            name="price"
            value={values.price.toString()}
            onChange={(e) => onChangeInputs(e)}
            placeholder="Valor"
            fullWidth
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
                onChange={(newValue) => setSelectedDate(newValue || dayjs())}
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
              className={type ? styles.deposit : ""}
              type="button"
              onClick={() => setType(true)}
            >
              <img src="/images/income.svg" alt="Entrada" />
              <span>Entrada</span>
            </button>
            <button
              className={type ? "" : styles.withraw}
              type="button"
              onClick={() => setType(false)}
            >
              <img src="/images/outcome.svg" alt="Saida" />
              <span>Saida</span>
            </button>
          </div>
          <TextField
            multiline
            rows={4}
            name="description"
            value={values.description}
            onChange={(e) => onChangeInputs(e)}
            placeholder="Descrição"
            fullWidth
          />

          <Button
            size="large"
            variant="contained"
            fullWidth
            disabled={isLoading}
            color="success"
            type="submit"
          >
            {isLoading ? <CircularProgress size={22} /> : "Cadastrar"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
