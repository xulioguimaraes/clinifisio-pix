import { ITable, ITransaction } from "../../interface/interfaces";
import { Box, Button, CircularProgress, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { useDataTableContext } from "@/hooks/useDataTable";
import { TransactionModal } from "../TransactionModal/TransactionModal";
import { useState } from "react";
import styles from "./styles.module.scss";
const paginationModel = { page: 0, pageSize: 10 };
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "title", headerName: "Titulo", flex: 1 },
  {
    field: "price",
    headerName: "Valor",
    flex: 1,
    renderCell: ({ row }) => {
      return (
        <>
          <div
            className={`${
              row.type ? "text-green-400" : "text-red-400"
            } w-full font-semibold`}
          >
            {row.type ? "" : `- `}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(row.price / 100)}
          </div>
        </>
      );
    },
  },
  {
    field: "description",
    headerName: "Descrição",
    type: "number",
    flex: 1,
  },
];
export const Table = () => {
  const { lisTransation, onOpenNewTransactionModal, isLoading } =
    useDataTableContext();
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
      <div className="flex justify-end mb-4">
        <Button
          onClick={onOpenNewTransactionModal}
          color="success"
          startIcon={<Add />}
          variant="contained"
        >
          Nova Transação
        </Button>
      </div>
      <Paper sx={{ height: 400, width: "100%", position: "relative" }}>
        {isLoading ? (
          <>
            <div className={styles.desfocado}></div>
            <div className="absolute z-20 inset-0 flex items-center justify-center">
              <CircularProgress />
            </div>
          </>
        ) : (
          <></>
        )}
        <DataGrid
          rows={lisTransation}
          columns={columns}
          disableAutosize
          disableColumnSelector
          onRowClick={({ row }) => {
            handleTransaction(row);
          }}
          density="compact"
          disableColumnResize
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20, 30, 50, 100]}
          sx={{ border: 0 }}
        />
      </Paper>

      <TransactionModal
        isOpen={onTransactionModal}
        setModal={onCloseModal}
        transaction={transaction}
      />
    </>
  );
};
