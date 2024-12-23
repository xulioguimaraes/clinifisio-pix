import { useEffect } from "react"
import { ITable, ITransaction } from "../../interface/interfaces"
import { queryClient } from "../../services/queryClient"
import styles from "./styles.module.scss"

export const Table = ({ handleTransaction }: ITable) => {
  const transaction = queryClient.getQueryData<ITransaction[]>("list")

  return (
    <>
      <table className={styles.container}>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transaction?.map(item => {
            return <tr key={item.id} onClick={() => handleTransaction(item)}>
              <td><div className={styles.title}>{item.title}</div></td>
              <td className={item.type ? styles.deposit : styles.withraw}
              >{item.type ? "" : `- `}
                {new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(item.price / 100)}</td>
              <td ><div className={styles.desc}>{item.description}</div></td>            
              <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(item.createdAt.slice(0,19)))}</td>
            </tr>
          })}
        </tbody>
      </table></>
  )
}
