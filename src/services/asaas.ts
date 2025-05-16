// src/services/asaas.ts
import axios from "axios";

// Configuração base do Axios para o Asaas

export const asaasApi = axios.create({
  baseURL: "https://api-sandbox.asaas.com/v3",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    access_token:
      "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmEzODkwYTQxLTY1ZGMtNGI2Yi1hYzNhLTE0ODg5OTk5ZWVlYTo6JGFhY2hfYWI3ODkwYTUtMGJjNS00OTQxLWI3MjEtNmM1NGZkNjhhYTRk", // Enviado no header (não no body)
  },
});
