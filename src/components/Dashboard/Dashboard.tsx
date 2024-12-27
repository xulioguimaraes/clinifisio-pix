import { Summary } from "../Summary/Summary";
import { TransationTable } from "../TransationTable/TransationTable";
import styles from "./styles.module.scss";

export const Dashboard = ({
  onOpenNewTransactionModal,
}: {
  onOpenNewTransactionModal: () => void;
}) => {
  return (
    <main className={styles.container}>
      <Summary />
      <TransationTable onOpenNewTransactionModal={onOpenNewTransactionModal} />
    </main>
  );
};
