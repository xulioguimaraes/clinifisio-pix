import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "name", headerName: "Nome", flex: 1 },
  {
    field: "price",
    headerName: "Preço",
    flex: 0.5,
    type: "number",
    renderCell: ({ row }) => {
      return (
        <div className="font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.price / 100)}
        </div>
      );
    },
  },
  {
    field: "description",
    headerName: "Descrição",

    flex: 2,
  },
];
