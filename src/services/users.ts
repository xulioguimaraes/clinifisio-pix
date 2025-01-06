import { api } from "./api";

export const users = {
  getUserData: async () => {
    return await api.get("/users/find").then((item) => {
      return item;
    });
  },
  getServicesUser: async (username: string) => {
    return await api.get(`/users/user-services/${username}`).then((item) => {
      return item;
    });
  },
};
