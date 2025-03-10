import { api } from "./api";

export const scheduling = {
  listSchedulings: async (params: {
    search: string;
    page: number;
    per_page: number;
  }) => api.get("/schedulings/list-schedulings", { params }),
  updateStatus: async (id: string, status: number, toast: any) => {
    return api
      .patch(`/schedulings/update-status/${id}`, {
        status,
      })
      .then((item) => item)
      .catch((item) => {
        toast.error("Error ao salvar" + item);
      });
  },
};
