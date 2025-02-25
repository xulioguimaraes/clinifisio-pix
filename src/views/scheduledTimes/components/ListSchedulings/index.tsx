import { scheduling } from "@/services/schedulings";
import { Add, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styles from "@/styles/global.module.scss";
import { columns } from "./columns";
import { Scheduling } from "@/types";
import { useScheduling } from "../../hooks/useScheduling";

export const ListSchedulings = ({ value }: { value: "two" }) => {
  const [openSearchTerm, setOpenSearchTerm] = useState(false);
  const { handleScheduling: onScheduling, params, setParams } = useScheduling();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo de pesquisa
  const [total, setTotal] = useState(0);
  useEffect(() => {
    console.log(params);
  }, [params]);

  const { data: listData, isLoading } = useQuery<{ data: Scheduling[] }>(
    ["list-schedulings", params],
    async () => {
      if (value === "two") {
        console.log(params);
        const response = await scheduling.listSchedulings(params);
        setTotal(response.data.total);
        return response.data;
      }
      return [];
    },
    { keepPreviousData: false }
  );
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setParams((old) => ({ ...old, search: value, per_page: 10, page: 1 }));
    }, 1000); // 500ms de delay

    setDebounceTimeout(timeout);
  };

  const handleScheduling = (item: any) => {
    onScheduling(item);
  };

  return (
    <Box>
      <>
        <Box display={"flex"} justifyContent={"end"} my={2} gap={1}>
          <Button
            onClick={() => setOpenSearchTerm(!openSearchTerm)}
            color="primary"
            startIcon={<Search />}
            variant="contained"
          >
            Pesquisar
          </Button>
          {/* <Button
            onClick={onOpenModal}
            color="success"
            startIcon={<Add />}
            variant="contained"
          >
            Novo Agendamento
          </Button> */}
        </Box>
        <Collapse in={openSearchTerm}>
          <TextField
            fullWidth
            focused
            className="mb-4"
            placeholder="Digite o que deseja pesquisar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Collapse>

        <Paper
          sx={{
            height: 450,
            width: "100%",
            position: "relative",
          }}
        >
          {isLoading ? (
            <>
              <div className={styles.desfocado}></div>
              <div className="absolute z-20 inset-0 flex flex-col items-center justify-center">
                <CircularProgress />
                <p className="text-xs pt-8">Atualizando...</p>
              </div>
            </>
          ) : (
            <></>
          )}
          <DataGrid
            rows={listData?.data || []}
            columns={columns}
            disableAutosize
            disableColumnSelector
            onRowClick={({ row }) => {
              handleScheduling(row);
            }}
            onCellClick={(params, event) => {
              if (params.field === "active") {
                event.stopPropagation();
              }
            }}
            paginationMode="server"
            density="compact"
            disableColumnResize
            initialState={{
              pagination: {
                paginationModel: {
                  page: params.page - 1,
                  pageSize: params.per_page,
                },
              },
            }}
            rowCount={total}
            pageSizeOptions={[10, 20, 30, 50, 100]}
            onPaginationModelChange={(row) => {
              setParams((old) => ({
                ...old,
                per_page: row.pageSize,
                page: row.page + 1,
              }));
            }}
            sx={{ border: 0 }}
          />
        </Paper>
      </>
    </Box>
  );
};
