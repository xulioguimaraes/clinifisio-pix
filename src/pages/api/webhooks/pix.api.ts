import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      // Log do corpo da requisição
      console.log("Webhook PIX recebido:");
      console.log("Headers:", request.headers);
      console.log("Body:", request.body);

      // Aqui você pode adicionar a lógica para processar o pagamento
      // Por exemplo, verificar o status do pagamento e atualizar o banco de dados

      return response.status(200).json({ message: "Webhook recebido com sucesso" });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  return response.status(405).json({ error: "Método não permitido" });
} 