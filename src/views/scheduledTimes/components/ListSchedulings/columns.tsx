/* eslint-disable react-hooks/rules-of-hooks */
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";

export const columns: GridColDef[] = [
  { field: "name", headerName: "Nome", flex: 1 },
  {
    field: "date",
    headerName: "Data",
    flex: 1,
    renderCell: ({ row }) => {
      return dayjs(row.date).format("DD/MM/YYYY");
    },
  },
  {
    field: "service",
    headerName: "Serviço",
    flex: 1,
    renderCell: ({ row }) => {
      return row.service.name;
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: ({ row }) => {
      let status = "";
      let color = "";

      switch (row.status) {
        case 1:
          color = "#DCF8C7";
          status = "Pendente";
          break;
        case 2:
          color = "#4CAF50";
          status = "Confirmado";
          break;
        case 3:
          color = "#F5C6C1";
          status = "Cancelado";
          break;
        case 4:
          color = "#B6E3F5";
          status = "Atendido";
          break;

        default:
          color = "#DCF8C7";
          status = "Pendente";

          break;
      }

      return (
        <Box color={color} fontWeight={"600"}>
          {status.toUpperCase()}
        </Box>
      );
    },
  },
];
