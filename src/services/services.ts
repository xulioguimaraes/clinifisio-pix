import { IServices } from "@/types";
import { api } from "./api";
interface IParams {
  per_page: number;
  page: number;
  search: string;
}

export const services = {
  getListServices: async (params: IParams) => {
    return await api
      .get("/transction/list-services", { params })
      .then((item) => {
        return item;
      });
  },
  createServices: async (data: IServices) => {
    return await api
      .post("/transction/create-service", data)
      .then((item) => item);
  },
  deleteServices: async (id: string) => {
    return await api
      .delete(`/transction/deletetransaction/${id}`)
      .then((item) => {
        return item;
      });
  },
};
