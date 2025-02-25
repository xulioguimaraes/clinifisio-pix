import { api } from "./api";

export const users = {
  getUserData: async () => {
    return await api.get("/users/find").then((item) => {
      return item;
    });
  },
  getTimeIntervals: async () => {
    return await api.get("/users/get-time-intervals").then((item) => {
      return item;
    });
  },
  getServicesUser: async (username: string) => {
    return await api.get(`/users/user-services/${username}`).then((item) => {
      return item;
    });
  },
  getBlockedDays: async (username: string, params: any) => {
    return await api.get(`/users/${username}/blocked-dates`, {
      params,
    });
  },
  getAvailableTimes: async (username: string, params: any) => {
    return await api.get(`/users/${username}/week-availability`, {
      params,
    });
  },
  confirmSheduling: async (
    username: string,
    {
      name,
      email,
      observations,
      phone,
      date,
      id_service,
    }: {
      name: string;
      email: string;
      observations: string;
      phone: string;
      date: Date;
      id_service: string;
    },
    toast: any
  ) => {
    return await api
      .post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        phone,
        date,
        id_service,
      })
      .then((item) => item)
      .catch((item) => toast.error(item));
  },
};
