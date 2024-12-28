import React, { FormEvent, useEffect, useState } from "react";
import { ITransaction } from "../../interface/interfaces";

import styles from "./styles.module.scss";
import { Modal } from "../Modal/Modal";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import { transaction as transactionservice } from "@/services/transaction";
import { useDataTableContext } from "@/hooks/useDataTable";

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
  }, [transaction, isOpen]);
  const handleCreateNewTransaction = async (e: FormEvent) => {
    e.preventDefault();
  };
  const onRequestClose = () => {
    setValues(initialValues);
    setModal();
  };
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await transactionservice.deleteTransaction(id);
      setIsLoading(false);

      const copyParams = { ...params };
      setParams(copyParams);
      handleClick();
      onRequestClose();
    } catch (error: any) {
      //falta implementar um hook para o toast para se usar em todos os lugares do projeto
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
            // onChange={e => onChangeInputs(e)}
            placeholder="Valor"
          />
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
              {isLoading ? <CircularProgress size={20} /> : "Deletar"}
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
              {isLoading ? <CircularProgress size={20} /> : "Fechar"}
            </Button>
          </div>
        </form>
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
          Transação excluida com sucesso
        </Alert>
      </Snackbar>
    </>
  );
};
