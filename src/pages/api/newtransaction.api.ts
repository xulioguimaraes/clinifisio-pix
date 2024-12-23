import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      const { userId, accountId, title, price, description, type } =
        request.body;
      console.log(!userId || !title || price == null || type == null);
      console.log(userId);
      console.log(title);
      console.log(price);
      console.log(type);
      if (!userId || !title || price == null || type == null) {
        return response.status(400).json({
          error: "Missing required fields: userId, title, price, or type.",
        });
      }

      // Criando uma nova transação
      const transaction = await prisma.transation.create({
        data: {
          userId: userId, // Associando a um usuário
          title: String(title),
          price: Number(price),
          description: description ? String(description) : null,
          type: Boolean(type),
        },
      });

      return response.status(200).json(transaction);
    } catch (err) {
      console.log(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use POST." });
}
