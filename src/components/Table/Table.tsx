import {
  Button,
  CircularProgress,
  Collapse,
  Paper,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Search, FilterList } from "@mui/icons-material";
import { useDataTableContext } from "@/hooks/useDataTable";
import { TransactionModal } from "../TransactionModal/TransactionModal";
import { useState } from "react";
import { useColumns } from "./columns";
import { ITransaction } from "@/types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// Configure dayjs to use Brazilian locale
dayjs.locale("pt-br");

export const Table = () => {
  const {
    lisTransation,
    onOpenNewTransactionModal,
    isLoading,
    params,
    total,
    setParams,
    summary,
  } = useDataTableContext();
  const [onTransactionModal, setOnTransactionModal] = useState(false);
  const [openSearchTerm, setOpenSearchTerm] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [type, setType] = useState<string>("");

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
    }, 1000);

    setDebounceTimeout(timeout);
  };

  const formatDate = (date: string) => {
    return dayjs(date).utc().format("DD/MM/YYYY");
  };

  const handleFilterChange = () => {
    setParams((old) => ({
      ...old,
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      type: type,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setType("");
    setParams((old) => ({
      ...old,
      startDate: undefined,
      endDate: undefined,
      type: undefined,
      page: 1,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const columns = useColumns();
  const dateRange = endDate
    ? `de ${formatDate(startDate as unknown as string)} até ${formatDate(
        endDate as unknown as string
      )}`
    : `do dia ${formatDate(startDate as unknown as string)}`;

  return (
    <>
      <Box bgcolor={"#202024"} p={1.5} borderRadius={4} my={2} mx={1}>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button
            onClick={() => setOpenSearchTerm(!openSearchTerm)}
            color="primary"
            startIcon={<Search />}
            variant="contained"
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => setOpenFilters(!openFilters)}
            color="primary"
            startIcon={<FilterList />}
            variant="contained"
          >
            Filtros
          </Button>
          <Button
            onClick={onOpenNewTransactionModal}
            color="success"
            startIcon={<Add />}
            variant="contained"
          >
            Nova Transação
          </Button>
        </Stack>

        {(openSearchTerm || openFilters) && (
          <Stack gap={1} pt={1}>
            <Collapse unmountOnExit in={openSearchTerm}>
              <TextField
                fullWidth
                size="small"
                disabled={isLoading}
                placeholder="Digite o que deseja pesquisar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Collapse>

            <Box display="flex" justifyContent="center">
              <Collapse unmountOnExit in={openFilters}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  gap={1}
                  sx={{
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    width: "fit-content",
                    pt: 1,
                  }}
                >
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"
                  >
                    <DatePicker
                      label="Data Inicial"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      disabled={isLoading}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                    <DatePicker
                      label="Data Final"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      disabled={isLoading}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      disabled={isLoading}
                      value={type}
                      label="Tipo"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="true">Entradas</MenuItem>
                      <MenuItem value="false">Saídas</MenuItem>
                    </Select>
                  </FormControl>

                  <Stack direction="row" gap={1}>
                    <Button
                      variant="contained"
                      disabled={isLoading}
                      color="primary"
                      onClick={handleFilterChange}
                    >
                      Aplicar Filtros
                    </Button>

                    <Button
                      disabled={isLoading}
                      variant="outlined"
                      color="primary"
                      onClick={handleClearFilters}
                    >
                      Limpar Filtros
                    </Button>
                  </Stack>
                </Stack>
              </Collapse>
            </Box>
          </Stack>
        )}

        <Collapse
          unmountOnExit
          in={!!summary && lisTransation.length > 0 && !isLoading}
        >
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Período {dateRange}
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  {summary?.incomes.label}{" "}
                  {formatCurrency(summary?.incomes.value ?? 0)}
                </Typography>
                <Typography>
                  {summary?.expenses.label}{" "}
                  {formatCurrency(summary?.expenses.value ?? 0)}
                </Typography>
                <Typography
                  sx={{
                    color:
                      (summary?.balance.value ?? 0) >= 0
                        ? "success.main"
                        : "error.main",
                    fontWeight: "bold",
                  }}
                >
                  {summary?.balance.label}{" "}
                  {formatCurrency(summary?.balance.value ?? 0)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Collapse>
      </Box>

      <Paper
        sx={{
          height: 450,
          width: "100%",
          position: "relative",
          mb: {
            md: 0,
            xl: 0,
            xs: 10,
          },
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(2px)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
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
          sx={{
            border: 0,
          }}
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
