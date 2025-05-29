import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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

      const { event, payment } = request.body;

      // Verifica se é um evento de pagamento confirmado
      if (event === "PAYMENT_RECEIVED") {
        // Busca a transação PIX pelo ID do QR Code
        const transactionPix = await prisma.transactionPix.findUnique({
          where: {
            pixId: payment.pixQrCodeId,
          },
        });

        if (transactionPix) {
          // Atualiza a transação com o status e as URLs do comprovante
          await prisma.transactionPix.update({
            where: {
              id: transactionPix.id,
            },
            data: {
              status: "paid",
              receiptUrl: payment.transactionReceiptUrl || null,
              transactionId: payment.id,
            },
          });

          // Atualiza o status do agendamento para confirmado
          if (transactionPix.schedulingId) {
            await prisma.scheduling.update({
              where: {
                id: transactionPix.schedulingId,
              },
              data: {
                status: 2, // 2 = Confirmado
              },
            });
          }

          console.log("Transação PIX atualizada com sucesso:", {
            transactionId: payment.id,
            pixQrCodeId: payment.pixQrCodeId,
            status: "paid",
            receiptUrl: payment.transactionReceiptUrl,
          });
        } else {
          console.log(
            "Transação PIX não encontrada para o QR Code:",
            payment.pixQrCodeId
          );
        }
      }

      return response
        .status(200)
        .json({ message: "Webhook processado com sucesso" });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  return response.status(405).json({ error: "Método não permitido" });
}
