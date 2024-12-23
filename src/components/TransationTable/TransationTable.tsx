import { useState } from "react";

import { ITransaction } from "../../interface/interfaces";

import { CardMobile } from "../CardMobile/CardMobile";
import { Table } from "../Table/Table";
import { TransactionModal } from "../TransactionModal/TransactionModal";
import styles from "./styles.module.scss";

export const TransationTable = () => {
  const [onTransactionModal, setOnTransactionModal] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const handleTransaction = (item: ITransaction) => {
    if (item.description === "" && item.price === 0 && item.title === "") {
      return;
    }
    setOnTransactionModal(true);
    setTransaction(item);
  };
  const onCloseModal = () => {
    setOnTransactionModal(false);
  };
  return (
    <>
      <div className={styles.container}>
        <Table handleTransaction={handleTransaction} />
        <CardMobile handleTransaction={handleTransaction} />
      </div>
      <TransactionModal
        isOpen={onTransactionModal}
        setModal={onCloseModal}
        transaction={transaction}
      />
    </>
  );
};
