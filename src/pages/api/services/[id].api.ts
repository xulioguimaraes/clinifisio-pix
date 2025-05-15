import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
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

  if (request.method === "GET") {
    try {
      // Extrai o ID da URL (api/[id])
      const { id } = request.query;

      if (!id) {
        return response.status(400).json({ error: "ID is required" });
      }

      const service = await prisma.service.findUnique({
        where: {
          id: String(id), // Converte para string (caso necessário)
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          porcentagem: true,
          images: true, // Garantindo que images seja incluído
          active: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });

      if (!service) {
        return response.status(404).json({ error: "Service not found" });
      }

      return response.status(200).json({
        data: service,
      });
    } catch (error) {
      console.error("Error fetching service:", error);
      return response.status(500).json({ error: "Error fetching service" });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
