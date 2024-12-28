import { FormEvent, useState } from "react";
import ReactModal from "react-modal";
import { IValuesTransactionModal } from "../../interface/interfaces";
import { Spinner } from "../Spinner/Spinner";
import styles from "./styles.module.scss";
import { transaction } from "@/services/transaction";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import { useDataTableContext } from "@/hooks/useDataTable";
import { Modal } from "../Modal/Modal";
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
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const handleCreateNewTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (values.title === "" || values.price === "") {
      setValueIsEmpty(true);
      return;
    }
    // setIsOpen(true)
    const objSend = {
      ...values,
      price: values.price.replace(/[^0-9]/g, ""),
      type: type,
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
      closeSpinner();
      handleClick();
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
              <h3>{"Preencha os campos de Titulo e Preço"}</h3>
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
            {isLoading ? <CircularProgress size={20} /> : "Cadastrar"}
          </Button>
        </Box>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Transação cadastrada com sucesso
        </Alert>
      </Snackbar>
    </>
  );
};
