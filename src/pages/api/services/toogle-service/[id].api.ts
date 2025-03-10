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

  if (request.method === "PATCH") {
    try {
      const { id } = request.query;

      if (!id || typeof id !== "string") {
        return response
          .status(400)
          .json({ error: "Invalid or missing ID parameter" });
      }

      const userId = session.user.id;

      // Busca o estado atual da coluna 'active'
      const service = await prisma.service.findFirst({
        where: {
          id: String(id),
          userId: userId,
        },
      });

      if (!service) {
        return response.status(404).json({ error: "Service not found" });
      }

      await prisma.service.update({
        where: {
          id: service.id, // Aqui usamos o id do serviço encontrado
        },
        data: {
          active: !service.active, // Alterando o valor de `active`
        },
      });

      return response
        .status(200)
        .json({ message: "Active state updated successfully" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use PATCH." });
}
