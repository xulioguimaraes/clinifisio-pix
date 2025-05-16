// pages/api/pix/create-key.ts
import { NextApiRequest, NextApiResponse } from "next";
import { asaasApi } from "@/services/asaas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verifica se o método é POST
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({ error: "Método não permitido" });
  }

  try {
    // Faz a requisição para a API do Asaas usando sua instância configurada
    const response = await asaasApi.post("/pix/addressKeys", {
      type: "EVP", // Tipo EVP (chave aleatória)
    });

    // Retorna a chave PIX criada
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Erro ao criar chave PIX:", error);

    // Tratamento de erros específicos do Asaas
    if (error.response) {
      return res.status(error.response.status).json({
        error:
          error.response.data?.errors?.[0]?.description ||
          "Erro ao criar chave PIX na API Asaas",
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
}
