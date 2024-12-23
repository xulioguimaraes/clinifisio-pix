import React, { FormEvent, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { ITransaction } from "../../interface/interfaces";
import deleteTransaction from "../../services/deleteTransaction";
import { queryClient } from "../../services/queryClient";

import styles from "./styles.module.scss";

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
    created_at: "",
  };
};
ReactModal.setAppElement("#__next");

export const TransactionModal = ({
  isOpen,
  setModal,
  transaction,
}: ITransactionModal) => {
  const [values, setValues] = useState<ITransaction>(transaction);
  const [error, setError] = useState(false);

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
    const response = await deleteTransaction(id);

    if (response) {
      let arrayTransaction = queryClient.getQueryData<ITransaction[]>("list");
      arrayTransaction = arrayTransaction.filter((item) => {
        if (item.id !== transaction.id) {
          return item;
        }
      });
      console.log(arrayTransaction);
      onRequestClose();
      return queryClient.setQueryData("list", arrayTransaction);
    } else {
      setError(true);
    }
  };
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={`${styles.modalOverlay}`}
      className={`${styles.modalContent}`}
    >
      <button
        className={styles.modalClose}
        type="button"
        onClick={onRequestClose}
      >
        <img src="/images/close.svg" alt="fechar modal" />
      </button>
      <form className={styles.container} onSubmit={handleCreateNewTransaction}>
        <h2>Informação da transação</h2>
        {error && (
          <section className="__error">
            <h3>{"Erro ao deletar transação"}</h3>
          </section>
        )}
        <input
          type="text"
          name="title"
          value={values?.title}
          disabled
          // onChange={e => onChangeInputs(e)}
          placeholder="Titulo"
        />
        <input
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
        <textarea
          name="description"
          disabled
          value={values?.description}
          placeholder="Descrição"
        />
        <section className={styles.containerButton}>
          <button
            onClick={() => handleDelete(values?.id)}
            className={styles.delete}
          >
            Deletar
          </button>
          <button type="submit">OK</button>
        </section>
      </form>
    </ReactModal>
  );
};
