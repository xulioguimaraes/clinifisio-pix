// src/services/asaas.ts
import axios from "axios";

// Configuração base do Axios para o Asaas
const asaasUrl = process.env.NEXT_PUBLIC_ASAAS_API_URL;
const asaasKey = process.env.NEXT_PUBLIC_ASAAS_API_KEY;

export const asaasApi = axios.create({
  baseURL: asaasUrl,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    access_token: asaasKey,
  },
});
