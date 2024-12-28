import Head from "next/head";
import { useEffect, useState } from "react";
import getDateTransaction from "../../services/getDateTransaction";
import styles from "./styles.module.scss";
import { useDataTableContext } from "@/hooks/useDataTable";
interface IGetDateTransaction {
  dateTypeFalse: { createdAt: string };
  dateTypeTrue: { createdAt: string };
}
export const Summary = () => {
  const { lisTransation } = useDataTableContext();
  const [entrada, setEntrada] = useState("R$ 0");
  const [saida, setSaida] = useState("R$ 0");
  const [total, setTotal] = useState(0);
  const [dateTransaction, setdateTransaction] = useState({
    entry: "",
    withdrawal: "",
  });

  useEffect(() => {
    if (lisTransation?.length > 0) {
      let inValue = 0,
        outValue = 0;
      lisTransation.forEach((item) => {
        if (item.type) {
          return (inValue = inValue + item.price);
        }
        return (outValue = outValue + item.price);
      });

      let inV = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(inValue / 100);
      let out = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(outValue / 100);
      setEntrada(inV);
      setSaida(out);
      setTotal((inValue - outValue) / 100);
    }
  }, [lisTransation]);
  useEffect(() => {
    if (lisTransation?.length === 0) {
      setEntrada("R$ 0");
      setSaida("R$ 0");
      setTotal(0);
    }
  }, [lisTransation]);
  useEffect(() => {
    getDateTrans();
  }, [lisTransation]);
  const getDateTrans = async () => {
    const { dateTypeFalse, dateTypeTrue } =
      (await getDateTransaction()) as IGetDateTransaction;
    setdateTransaction({
      entry: new Date(dateTypeTrue?.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      }),
      withdrawal: new Date(dateTypeFalse?.createdAt).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
        }
      ),
    });
  };

  return (
    <>
      <Head>
        <title>Painel | Clinifisio</title>
      </Head>
      <div className={styles.container}>
        <div>
          <header>
            <p>Entradas</p>
            <img src="/images/income.svg" alt="Entradas" />
          </header>
          <strong className={styles.deposit}>{entrada}</strong>
          {dateTransaction.entry === "Invalid Date" ? (
            ""
          ) : (
            <>
              <label>Ultima entrada dia {dateTransaction.entry}</label>
            </>
          )}
        </div>
        <div>
          <header>
            <p>Saidas</p>
            <img src="/images/outcome.svg" alt="Saidas" />
          </header>
          <strong className={styles.withraw}>{saida}</strong>
          {dateTransaction.withdrawal === "Invalid Date" ? (
            ""
          ) : (
            <>
              <label>Ultima saida dia {dateTransaction.withdrawal}</label>
            </>
          )}
        </div>
        <div
          className={styles.total}
          style={
            total < 0 ? { background: "var(--red)", color: "var(--shape)" } : {}
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
    </>
  );
};
