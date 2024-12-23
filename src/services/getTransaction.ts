import { useQuery } from "react-query";
import { api } from "./api";

const resposeTransaction = async () => {
  return await api.get("/listtrasaction").then((item) => {
    return item.data;
  });
};
export default () => {
  const data = useQuery("list", resposeTransaction);
  return data;
};
