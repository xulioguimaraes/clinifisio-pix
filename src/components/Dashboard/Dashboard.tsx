import { Summary } from "../Summary/Summary";
import { Table } from "../Table/Table";
import styles from "./styles.module.scss";

export const Dashboard = () => {
  return (
    <main className={styles.container}>
      <Summary />
      <div className={styles.container}>
        <Table />
      </div>
    </main>
  );
};
