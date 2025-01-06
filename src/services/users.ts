import { api } from "./api";

export const users = {
  getUserData: async () => {
    return await api.get("/users/find").then((item) => {
      return item;
    });
  },
};
