import { ITable, ITransaction } from "../../interface/interfaces";
import { queryClient } from "../../services/queryClient";
import styles from "./styles.module.scss";
export const CardMobile = ({ handleTransaction }: ITable) => {
  const transaction = queryClient.getQueryData<ITransaction[]>("list");

  return (
    <section className={styles.container}>
      <aside>
        <h2>Listagem</h2>
        <label>{transaction?.length} itens</label>
      </aside>
      {transaction?.map((item) => {
        return (
          <div key={item.id} onClick={() => handleTransaction(item)}>
            <h3>{item?.title}</h3>
            <h1 className={item.type ? styles.deposit : styles.withraw}>
              {item.type ? "" : `- `}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.price / 100)}
            </h1>
            <div>
              <label>{item.description}</label>
              <label>
                {new Intl.DateTimeFormat("pt-BR").format(
                  Date.parse(item.createdAt)
                )}
              </label>
            </div>
          </div>
        );
      })}
    </section>
  );
};
