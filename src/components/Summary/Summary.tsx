import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Divider } from "@mui/material";
import { transaction } from "@/services/transaction";
import {
  converNumberForMoney,
  convertDateInFormatLongPtBr,
} from "@/utils/conver-time-string-to-minutes";

export const Summary = () => {
  const [entrada, setEntrada] = useState("R$ 0");
  const [saida, setSaida] = useState("R$ 0");
  const [total, setTotal] = useState(0);
  const [dateTransaction, setdateTransaction] = useState({
    entry: "",
    withdrawal: "",
  });

  const getSumTransaction = async () => {
    const response = await transaction.getSumTransaction();
    if (response.status === 200) {
      setEntrada(converNumberForMoney(response.data.total_incomes));
      setSaida(converNumberForMoney(response.data.total_expenses));
      setTotal(
        (response.data.total_incomes - response.data.total_expenses) / 100
      );
      setdateTransaction({
        entry: response.data.date_last_incomes
          ? convertDateInFormatLongPtBr(response.data.date_last_incomes)
          : "",
        withdrawal: response?.data.date_last_expenses
          ? convertDateInFormatLongPtBr(response?.data.date_last_expenses)
          : "",
      });
    }
  };

  useEffect(() => {
    getSumTransaction();
  }, []);

  console.log(dateTransaction.entry);
  return (
    <>
      <Head>
        <title>Painel | Clinifisio</title>
      </Head>
      <div>
        <div className={styles.container}>
          <div>
            <header>
              <p>Entradas</p>
              <img src="/images/income.svg" alt="Entradas" />
            </header>
            <strong className={styles.deposit}>{entrada}</strong>
            {!!dateTransaction.entry && (
              <label>Ultima entrada dia {dateTransaction.entry}</label>
            )}
          </div>
          <div>
            <header>
              <p>Saidas</p>
              <img src="/images/outcome.svg" alt="Saidas" />
            </header>
            <strong className={styles.withraw}>{saida}</strong>
            {!!dateTransaction.entry && (
              <label>Ultima saida dia {dateTransaction.withdrawal}</label>
            )}
          </div>
          <div
            className={styles.total}
            style={
              total < 0
                ? { background: "var(--red)", color: "var(--shape)" }
                : {}
            }
          >
            <header>
              <p>Total</p>
              <img src="/images/total.svg" alt="Total" />
            </header>
            <strong>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(total)}
            </strong>
            {/* <label>01 à 15 de abril</label> */}
          </div>
        </div>
        <Divider className="pt-4" />
      </div>
    </>
  );
};
