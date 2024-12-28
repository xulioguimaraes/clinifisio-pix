import { Dashboard } from "@/components/Dashboard/Dashboard";
import { NewTrasactionModal } from "@/components/NewTrasactionModal/NewTrasactionModal";
import { DataTableProvider } from "@/hooks/useDataTable";

export const Transactions = () => {
  return (
    <DataTableProvider>
      <NewTrasactionModal />
      <Dashboard />
    </DataTableProvider>
  );
};
