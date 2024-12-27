import { ITable, ITransaction } from "../../interface/interfaces";
import { queryClient } from "../../services/queryClient";
import { Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";

const paginationModel = { page: 0, pageSize: 5 };
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
export const Table = ({
  handleTransaction,
  onOpenNewTransactionModal,
}: ITable) => {
  const transaction = queryClient.getQueryData<ITransaction[]>("list");

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
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={transaction}
          columns={columns}
          disableAutosize
          disableColumnSelector
          onRowClick={({ row }) => {
            handleTransaction(row);
          }}
          density="compact"
          disableColumnResize
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
};
