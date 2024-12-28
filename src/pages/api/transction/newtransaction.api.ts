import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(
    request,
    response,
    buildNextAuthOption(request, response)
  );
  if (!session) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  if (request.method === "POST") {
    try {
      const { title, price, description, type } = request.body;

      if (!title || price == null || type == null) {
        return response.status(400).json({
          error: "Missing required fields: userId, title, price, or type.",
        });
      }

      // Criando uma nova transação
      const transaction = await prisma.transation.create({
        data: {
          userId: session.user.id, // Associando a um usuário
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
