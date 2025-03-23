import { GridColDef } from "@mui/x-data-grid";
import { useMediaQuery, Theme } from "@mui/material";

export const useColumns = () => {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Titulo", flex: 1 },
    {
      field: "price",
      headerName: "Valor",
      flex: isXs ? 0.6 : 0.5,
      type: "number",
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
    ...(isXs
      ? []
      : [
          {
            field: "description",
            headerName: "Descrição",
            flex: 2,
          },
        ]),
  ];

  return columns;
};
