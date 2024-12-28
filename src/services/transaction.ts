import { IValuesTransactionModal } from "@/interface/interfaces";
import { api } from "./api";

export const transaction = {
  getListTransaction: async () => {
    return await api.get("/listtrasaction").then((item) => {
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
