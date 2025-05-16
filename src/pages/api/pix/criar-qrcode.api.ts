// pages/api/pix/create-qrcode.ts
import { NextApiRequest, NextApiResponse } from "next";
import { asaasApi } from "@/services/asaas";

// Tipos para os dados da requisição
interface CreatePixQrCodeRequest {
  value: number;
  format?: "ALL" | "BASE64" | "SVG" | "JPEG";
  expirationSeconds?: number;
  description?: string;
}

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
    // Validação básica dos dados de entrada
    const { value } = req.body;

    if (!value || typeof value !== "number" || value <= 0) {
      return res.status(400).json({
        error: "Valor inválido. Forneça um valor numérico positivo",
      });
    }

    // Configuração padrão com valores opcionais
    const payload: CreatePixQrCodeRequest = {
      value,
      format: req.body.format || "ALL", // Padrão: retorna todos os formatos
      expirationSeconds: req.body.expirationSeconds || 86400, // 24 horas
      description: req.body.description || "Pagamento de serviço",
    };

    // Faz a requisição para a API do Asaas
    const response = await asaasApi.post("/pix/qrCodes/static", payload);

    // Retorna o QR Code gerado
    return res.status(200).json({
      success: true,
      data: response.data,
      // Dados formatados para fácil consumo
      formatted: {
        payload: response.data.payload,
        expirationDate: new Date(
          Date.now() + payload.expirationSeconds! * 1000
        ),
        base64Image: response.data.encodedImage,
        value: response.data.value,
      },
    });
  } catch (error: any) {
    console.error("Erro ao gerar QR Code PIX:", error);

    // Tratamento detalhado de erros
    if (error.response) {
      const asaasError = error.response.data?.errors?.[0] || {};
      return res.status(error.response.status).json({
        error: asaasError.description || "Erro na API Asaas",
        code: asaasError.code,
        details: error.response.data,
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
}
