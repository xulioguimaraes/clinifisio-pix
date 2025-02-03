import { api } from "@/lib/axios";

export const scheduling = {
  listSchedulings: async (params: {
    search: string;
    page: number;
    per_page: number;
  }) => api.get("/schedulings/list-schedulings", { params }),
};
