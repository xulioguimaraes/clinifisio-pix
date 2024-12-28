import { ITransaction } from "@/interface/interfaces";
import { transaction } from "@/services/transaction";
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
  const [params, setParams] = useState({ per_page: 10, page: 1 });
  const [total, setTotal] = useState(0);
  const [isNewTrasactionModalOpen, setIsNewTrasactionModalOpen] =
    useState(false);
  const getData = async () => {
    setIsLoading(true);
    const response = await transaction.getListTransaction(params);
    setIsLoading(false);

    if (response.status === 200) {
      setTotal(response.data.total);
      setListTransation(response.data.data);
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
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
