import { transaction } from "@/services/transaction";
import { ITransaction } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IParams {
  per_page: number;
  page: number;
  search: string;
  startDate?: string;
  endDate?: string;
  type?: string;
}

interface ISummary {
  incomes: {
    label: string;
    value: number;
  };
  expenses: {
    label: string;
    value: number;
  };
  balance: {
    label: string;
    value: number;
  };
}

interface DataTableContextType {
  lisTransation: ITransaction[];
  setParams: Dispatch<SetStateAction<IParams>>;
  params: IParams;
  onOpenNewTransactionModal: () => void;
  onCloseNewTransactionModal: () => void;
  isNewTrasactionModalOpen: boolean;
  isLoading: boolean;
  total: number;
  summary: ISummary | null;
}

const DataTableContext = createContext<DataTableContextType>(
  {} as DataTableContextType
);

export const useDataTableContext = () => useContext(DataTableContext);

export const DataTableProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lisTransation, setListTransation] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<IParams>({ 
    per_page: 10, 
    page: 1, 
    search: "" 
  });
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<ISummary | null>(null);
  const [isNewTrasactionModalOpen, setIsNewTrasactionModalOpen] =
    useState(false);

  const getData = async () => {
    setIsLoading(true);
    const response = await transaction.getListTransaction(params);
    setIsLoading(false);

    if (response.status === 200) {
      setTotal(response.data.total);
      setListTransation(response.data.data);
      setSummary(response.data.summary || null);
    }
  };

  const handleOpenNewTransactionModal = () => {
    setIsNewTrasactionModalOpen(true);
  };

  const handleCloseNewTransactionModal = () => {
    setIsNewTrasactionModalOpen(false);
  };

  useEffect(() => {
    getData();
  }, [params]);

  return (
    <DataTableContext.Provider
      value={{
        lisTransation,
        setParams,
        params,
        onOpenNewTransactionModal: handleOpenNewTransactionModal,
        onCloseNewTransactionModal: handleCloseNewTransactionModal,
        isNewTrasactionModalOpen,
        isLoading,
        total,
        summary,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
