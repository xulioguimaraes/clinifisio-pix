/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Theme, useMediaQuery } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
export const useColumns = () => {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      sortable: isXs ? false : true,
      filterable: false,
      cellClassName: ({ row }) => {
        let className = "";
        if (isXs) {
          switch (row.status) {
            case 1:
              className = "bg-pendente";
              break;
            case 2:
              className = "bg-confirmado";
              break;
            case 3:
              className = "bg-cancelado";
              break;
            case 4:
              className = "bg-atendido";
              break;
            default:
              className = "bg-pendente";
              break;
          }
        }

        return className;
      },
    },
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      sortable: isXs ? false : true,
      filterable: false,
      renderCell: ({ row }) => {

        return `${dayjs(row?.scheduling_date).format("DD/MM/YYYY")} às ${
          row.hours
        }:00`;
      },
      cellClassName: ({ row }) => {
        let className = "";
        if (isXs)
          switch (row.status) {
            case 1:
              className = "bg-pendente";
              break;
            case 2:
              className = "bg-confirmado";
              break;
            case 3:
              className = "bg-cancelado";
              break;
            case 4:
              className = "bg-atendido";
              break;
            default:
              className = "bg-pendente";
              break;
          }
        return className;
      },
    },
    {
      field: "service",
      headerName: "Serviço",
      flex: 1,
      sortable: isXs ? false : true,
      filterable: false,
      renderCell: ({ row }) => {
        return row.service.name;
      },
      cellClassName: ({ row }) => {
        let className = "";
        if (isXs)
          switch (row.status) {
            case 1:
              className = "bg-pendente";
              break;
            case 2:
              className = "bg-confirmado";
              break;
            case 3:
              className = "bg-cancelado";
              break;
            case 4:
              className = "bg-atendido";
              break;
            default:
              className = "bg-pendente";
              break;
          }
        return className;
      },
    },
    ...(!isXs
      ? [
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            sortable: isXs ? false : true,
            filterable: false,
            renderCell: ({ row }: any) => {
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
        ]
      : []),
  ];
  return columns;
};
