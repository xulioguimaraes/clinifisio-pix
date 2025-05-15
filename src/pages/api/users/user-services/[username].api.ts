import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { username } = request.query;

  if (!username || typeof username !== "string") {
    return response
      .status(400)
      .json({ error: "Invalid or missing username parameter." });
  }

  if (request.method === "GET") {
    try {
      // Busca os serviços com base no username
      const services = await prisma.service.findMany({
        where: {
          active: true,
          user: {
            username,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          porcentagem: true,
          active: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return response.status(200).json(services);
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use GET." });
}
