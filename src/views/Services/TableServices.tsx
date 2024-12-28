import {
  Button,
  CircularProgress,
  Collapse,
  Paper,
  TextField,
} from "@mui/material";
import styles from "@/styles/global.module.scss";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Search } from "@mui/icons-material";
import { columns } from "./columns";
import { IServices } from "@/types";
import { services } from "@/services/services";

export const TableServices = () => {
  const [onModal, setOnModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ per_page: 10, page: 1, search: "" });

  const [listServices, setListServices] = useState<IServices[]>([]);
  const [openSearchTerm, setOpenSearchTerm] = useState(false);
  const [service, setService] = useState<IServices>({} as IServices);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Armazena o timeout do debounce

  const getData = async () => {
    setIsLoading(true);
    const response = await services.getListServices(params);
    setIsLoading(false);

    if (response.status === 200) {
      setTotal(response.data.total);
      setListServices(response.data.data);
    }
  };

  useEffect(() => {
    getData();
  }, [params]);
  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo de pesquisa

  const handleServices = (item: IServices) => {
    setOnModal(true);
    setService(item);
  };
  const onCloseModal = () => {
    setOnModal(false);
  };
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
  return (
    <>
      <div className="flex justify-end my-4 gap-2">
        <Button
          onClick={() => setOpenSearchTerm(!openSearchTerm)}
          color="primary"
          startIcon={<Search />}
          variant="contained"
        >
          Pesquisar
        </Button>
        <Button
          onClick={onCloseModal}
          color="success"
          startIcon={<Add />}
          variant="contained"
        >
          Novo Serviço
        </Button>
      </div>
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
            <div className="absolute z-20 inset-0 flex items-center justify-center">
              <CircularProgress />
            </div>
          </>
        ) : (
          <></>
        )}
        <DataGrid
          rows={listServices}
          columns={columns}
          disableAutosize
          disableColumnSelector
          onRowClick={({ row }) => {
            handleServices(row);
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
  );
};
