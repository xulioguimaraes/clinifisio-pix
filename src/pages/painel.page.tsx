import { NewTrasactionModal } from "@/components/NewTrasactionModal/NewTrasactionModal";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { DataTableProvider } from "@/hooks/useDataTable";

export default function Painel() {
  return (
    <DataTableProvider>
      <NewTrasactionModal />
      <Dashboard />
    </DataTableProvider>
  );
}
