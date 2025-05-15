import { IServices } from "@/types";
import { api } from "./api";
import { AxiosRequestConfig } from "axios";
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

  getService: async (id: string) => {
    return await api.get(`/services/${id}`).then((item) => {
      return item;
    });
  },
  createServices: async (formData: FormData, config?: AxiosRequestConfig) => {
    return api.post("/services/create-service", formData, {
      ...config,
      headers: {
        ...config?.headers,
      },
    });
  },
  updateService: async (
    formData: FormData,
    id: string,
    config?: AxiosRequestConfig
  ) => {
    return api.put(`/services/update-service/${id}`, formData, {
      ...config,
      headers: {
        ...config?.headers,
      },
    });
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
