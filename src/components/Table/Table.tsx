import {
  Button,
  CircularProgress,
  Collapse,
  Paper,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add, Search } from "@mui/icons-material";
import { useDataTableContext } from "@/hooks/useDataTable";
import { TransactionModal } from "../TransactionModal/TransactionModal";
import { useState } from "react";
import styles from "./styles.module.scss";
import { useColumns } from "./columns";
import { ITransaction } from "@/types";

export const Table = () => {
  const {
    lisTransation,
    onOpenNewTransactionModal,
    isLoading,
    params,
    total,
    setParams,
  } = useDataTableContext();
  const [onTransactionModal, setOnTransactionModal] = useState(false);
  const [openSearchTerm, setOpenSearchTerm] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Armazena o timeout do debounce
  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo de pesquisa

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
  const columns = useColumns();

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
          onClick={onOpenNewTransactionModal}
          color="success"
          startIcon={<Add />}
          variant="contained"
        >
          Nova Transação
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
          rows={lisTransation}
          columns={columns}
          disableAutosize
          disableColumnSelector
          onRowClick={({ row }) => {
            handleTransaction(row);
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

      <TransactionModal
        isOpen={onTransactionModal}
        setModal={onCloseModal}
        transaction={transaction}
      />
    </>
  );
};
