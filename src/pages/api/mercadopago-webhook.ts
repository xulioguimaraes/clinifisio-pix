import type { NextApiRequest, NextApiResponse } from "next";

// Apenas para debug: loga tudo que chega do Mercado Pago
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Loga o método, headers e body da requisição
  console.log("Webhook Mercado Pago:");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // Retorna o body para visualização rápida
  res.status(200).json({
    message: "Webhook recebido com sucesso!",
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
}