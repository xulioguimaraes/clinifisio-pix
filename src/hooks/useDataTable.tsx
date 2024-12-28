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
interface DataTableContextType {
  lisTransation: ITransaction[];
  setParams: Dispatch<SetStateAction<{}>>;
  params: {};
  onOpenNewTransactionModal: () => void;
  onCloseNewTransactionModal: () => void;
  isNewTrasactionModalOpen: boolean;
  isLoading: boolean;
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
  const [params, setParams] = useState({});
  const [isNewTrasactionModalOpen, setIsNewTrasactionModalOpen] =
    useState(false);
  const getData = async () => {
    setIsLoading(true);
    const response = await transaction.getListTransaction();
    setIsLoading(false);

    if (response.status === 200) {
      setListTransation(response.data);
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
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
