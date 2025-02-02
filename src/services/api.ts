import axios from "axios";
import { destroyCookie } from "nookies";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_AXIOS_API_URL}`,
});

api.interceptors.response.use(
  (response) => {
    // Retorna a resposta normalmente
    return response;
  },
  (error) => {
    // Verifica se o status da resposta é 402
    if (error.response?.status === 401) {
      destroyCookie({ res: error.response }, "@call:userId", { path: "/" });

      // Redireciona para a página de login
      if (typeof window !== "undefined") {
        window.location.href = "/"; // Altere a rota para a página de login
      }
    }

    return Promise.reject(error);
  }
);
