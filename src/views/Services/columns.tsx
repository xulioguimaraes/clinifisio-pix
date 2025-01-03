/* eslint-disable react-hooks/rules-of-hooks */
import { useToastContext } from "@/hooks/useToast";
import { services } from "@/services/services";
import { CircularProgress, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

export const columns: GridColDef[] = [
  {
    field: "active",
    headerName: "Ativar",
    flex: 0.5,
    renderCell: ({ row }) => {
      const [checked, setChecked] = useState(!!row.active);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isLoading, setIsLoading] = useState(false);
      const toast = useToastContext();
      const handleChange = async (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setIsLoading(true);
        const response = await services.toogleService(row.id);
        setIsLoading(false);
        if (response.status === 200) {
          toast.success(response.data.message);
          setChecked(event.target.checked);
        }
      };
      return (
        <>
          {isLoading ? (
            <div className=" pt-6 ">
              <CircularProgress
                sx={{
                  mt: "0.5rem",
                  ml: "1rem",
                }}
                size={20}
              />
            </div>
          ) : (
            <Switch
              checked={checked}
              onChange={handleChange}
              disabled={isLoading}
              color="success"
              inputProps={{ "aria-label": "controlled" }}
            />
          )}
        </>
      );
    },
  },
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
