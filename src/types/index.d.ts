export interface ITransaction {
  id?: string;
  title: string;
  price: number;
  description: string;
  type: boolean;
  createdAt: string;
}
export interface ITable {
  handleTransaction: (e: ITransaction) => void;
  onOpenNewTransactionModal?: () => void;
}
export interface IValuesTransactionModal {
  id?: Number;
  title: string;
  price: string;
  description: string;
  type: boolean;
}

interface IServices {
  id?: string;
  name: string;
  description: any;
  price: number;
  porcentagem: any;
}
