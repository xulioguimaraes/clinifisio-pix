import { IValuesTransactionModal } from "@/interface/interfaces";
import { api } from "./api";
interface IParams {
  per_page: number;
  page: number;
}

export const transaction = {
  getListTransaction: async (params: IParams) => {
    return await api.get("/listtrasaction", { params }).then((item) => {
      return item;
    });
  },
  createTransaction: async (data: IValuesTransactionModal) => {
    return await api.post("/newtransaction", data).then((item) => item);
  },
  deleteTransaction: async (id: string) => {
    return await api.delete(`/deletetransaction/${id}`).then((item) => {
      return item;
    });
  },
};
