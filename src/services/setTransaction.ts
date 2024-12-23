import { ITransaction, IValuesTransactionModal } from "../interface/interfaces";
import { api } from "./api";

import { queryClient } from "./queryClient";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (objSend: IValuesTransactionModal) => {
  let arrayTransaction = queryClient.getQueryData<ITransaction[]>("list");
  const response = await api
    .post("/newtransaction", objSend)
    .then((item) => item.data)
    .catch(() => false);
  if (response) {
    arrayTransaction = [...arrayTransaction!, response[0]];
    arrayTransaction = arrayTransaction.sort((a, b) => {
      if (a.id > b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
    queryClient.setQueryData("list", arrayTransaction);
    return true;
  }
  return false;
};
