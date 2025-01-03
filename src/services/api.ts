import axios from "axios";

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
      // Redireciona para a página de login
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Altere a rota para a página de login
      }
    }

    return Promise.reject(error);
  }
);
