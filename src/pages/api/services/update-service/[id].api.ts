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

  if (request.method === "PUT") {
    try {
      // Extrai o ID da transação da URL
      const { id } = request.query;

      if (!id || typeof id !== "string") {
        return response
          .status(400)
          .json({ error: "Invalid or missing ID parameter" });
      }
      const { name, price, description, porcentagem, active } = request.body;

      if (!id) {
        return response
          .status(400)
          .json({ error: "Missing required field: id" });
      }
      const userId = session.user.id;
      await prisma.service.update({
        where: {
          id_userId: {
            id: String(id),
            userId: userId,
          },
        },
        data: {
          ...(name && { name }),
          ...(price != null && { price }),
          ...(description && { description }),
          ...(porcentagem != null && { porcentagem }),
          ...(active != null && { active }),
        },
      });

      return response.status(201).json({ message: "updated successfully" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use PUT." });
}
