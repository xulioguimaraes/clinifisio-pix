import { IServices } from "@/types";
import { api } from "./api";
interface IParams {
  per_page: number;
  page: number;
  search: string;
}

export const services = {
  getListServices: async (params: IParams) => {
    return await api.get("/services/list-services", { params }).then((item) => {
      return item;
    });
  },
  createServices: async (data: IServices) => {
    return await api
      .post("/services/create-service", data)
      .then((item) => item);
  },
  updateService: async (data: IServices, id: string) => {
    return await api
      .put(`/services/update-service/${id}`, data)
      .then((item) => item);
  },
  toogleService: async (id: string) => {
    return await api
      .patch(`/services/toogle-service/${id}`)
      .then((item) => item);
  },
  deleteServices: async (id: string) => {
    return await api
      .delete(`/services/deletetransaction/${id}`)
      .then((item) => {
        return item;
      });
  },
};
